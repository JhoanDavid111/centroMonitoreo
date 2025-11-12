import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import { useRef, useState, useMemo } from 'react';
import tokens from '../styles/theme.js';


import TooltipModal from './ui/TooltipModal';
import { useResumenCharts } from '../services/graficasService';
import { useTooltips } from '../services/tooltipsService';
import { getColorForTechnology, getColorForCategory } from '../lib/chart-colors';
import { singlePieTooltipFormatter, stackedColumnTooltipFormatter } from '../lib/chart-tooltips';

// ────────────────────────────────────────────────
// Mapeo Canónico para Tooltips
// Se utiliza para mapear el índice de la gráfica con el identificador del tooltip en la API.
// Los índices corresponden al orden en que se generan las gráficas en fetchData.
// 0: Distribución actual por tecnología -> res_chart_tec
// 1: Distribución de capacidad instalada por tipo de proyecto -> res_chart_cat
// 2: Capacidad entrante por mes -> res_chart_cap_ent
// 3: Evolución anual matriz energética despachada centralmente -> res_chart_matriz
// ────────────────────────────────────────────────
const CHART_TOOLTIP_MAP = {
  0: 'res_grafica_distribucion_actual_tecnologia',
  1: 'res_grafica_distribucion_capacidad_instalada_tipo_proyecto',
  2: 'res_grafica_capacidad_entrante_mes',
  3: 'res_grafica_evolucion_anual_matriz_energetica_despachada_centralmente_',

  
};

// ────────────────────────────────────────────────
// Utilidades
// ────────────────────────────────────────────────
const CHART_HEIGHT = 380;

const withHeight = (opts) => ({
  ...opts,
  chart: {
    backgroundColor: 'transparent',
    spacing: [10, 10, 10, 10],
    ...(opts.chart || {}),
    height: CHART_HEIGHT,
  },
  credits: { enabled: false },
});

const pieTecnologia = withHeight({
  chart: { type: 'pie' },
  // ... resto de opciones
});

const pieTipoProyecto = withHeight({
  chart: { type: 'pie' },
  // ... resto de opciones
});

const colCapacidadEntranteMes = withHeight({
  chart: { type: 'column' },
  // ... resto de opciones de columnas
});

const colEvolucionMatriz = withHeight({
  chart: { type: 'column' },
  // ... resto de opciones de columnas
});

// ────────────────────────────────────────────────
// Utilidades
// ────────────────────────────────────────────────

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────
export function ResumenCharts() {
  const [selected, setSelected] = useState('all');
  const chartRefs = useRef([]);

  // *** ESTADOS Y HOOKS PARA LA MODAL/TOOLTIPS ***
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // Usar el hook de cache centralizado
  const { data: tooltips = {}, isLoading: loadingTooltips, error: errorTooltips } = useTooltips();
  
  // Usar React Query para las queries paralelas
  const queries = useResumenCharts();
  const [techQuery, catQuery, entradaQuery, matQuery] = queries;

  const techJson = techQuery.data;
  const catJson = catQuery.data;
  const entradaJson = entradaQuery.data;
  const matJson = matQuery.data;

  const loading = queries.some(q => q.isLoading);
  const error = queries.find(q => q.error)?.error || null;

  // Función para cerrar la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent('');
  };
  
  // Función para manejar el clic en el botón de ayuda
  const handleHelpClick = (chartIndex, chartOptions) => {
    const tooltipId = CHART_TOOLTIP_MAP[chartIndex];
    const title = chartOptions.title?.text || `Gráfica ${chartIndex + 1}`;
    const content = tooltips[tooltipId]; // Obtener el contenido del tooltip

    if (tooltipId && content) {
      setModalTitle(title);
      setModalContent(content);
      setIsModalOpen(true);
    } else {
      setModalTitle('Información no disponible');
      setModalContent('No hay información de ayuda disponible para esta gráfica.');
      setIsModalOpen(true);
    }
  };

  // Procesar datos cuando estén disponibles
  const charts = useMemo(() => {
    if (!techJson || !catJson || !entradaJson || !matJson) return [];

    try {

        // Colores usando funciones centralizadas

        const opts = [];

        // 1) Pie tecnología (tooltip SOLO 1 slice) – altura uniforme
        opts.push(withHeight({
          chart: { type: 'pie', backgroundColor: tokens.colors.surface.primary },
          title: { text: 'Distribución actual por tecnología', align: 'left' },
          subtitle: { text: '' },
          legend: { itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y:.2f} MW ({point.percentage:.2f}%)',
                style: { fontSize: '12px', textOutline: 'none', color: tokens.colors.text.primary }
              },
              showInLegend: true
            }
          },
          series: [{
            name: 'Tecnología',
            colorByPoint: false,
            data: techJson.map(d => ({
              name: d.tipo_tecnologia,
              y: Number(d.capacidad_mw ?? d.valor ?? d.porcentaje),
              color: getColorForTechnology(d.tipo_tecnologia)
            }))
          }],
          tooltip: {
            useHTML: true,
            backgroundColor: tokens.colors.surface.primary,
            borderColor: '#666',
            formatter: singlePieTooltipFormatter
          },
          exporting: { enabled: true }
        }));

        // 2) Pie categoría (tooltip SOLO 1 slice) – altura uniforme
        opts.push(withHeight({
          chart: { type: 'pie', backgroundColor: tokens.colors.surface.primary },
          title: { text: 'Distribución de capacidad instalada por tipo de proyecto', align: 'left' },
          subtitle: { text: '' },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y:.2f} MW ({point.percentage:.2f}%)',
                style: { fontSize: '12px', textOutline: 'none', color: tokens.colors.text.primary }
              },
              showInLegend: true
            }
          },
          legend: { itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
          series: [{
            name: 'Categoría',
            colorByPoint: false,
            data: catJson.map(d => ({
              name: d.tipo_proyecto,
              y: Number(d.capacidad_mw ?? d.valor ?? d.porcentaje),
              color: getColorForCategory(d.tipo_proyecto)
            }))
          }],
          tooltip: {
            useHTML: true,
            backgroundColor: tokens.colors.surface.primary,
            borderColor: '#666',
            style: { color: tokens.colors.text.primary, fontSize: '13px' },
            padding: 10,
            formatter: singlePieTooltipFormatter,
          },
          exporting: { enabled: true }
        }));

        // 3) Columnas apiladas capacidad entrante por mes – altura uniforme
        const meses = entradaJson.map(item => item.mes);
        const tecnologias = Object.keys(entradaJson[0]).filter(k => k !== 'mes');
        const seriesData = tecnologias.map(tec => ({
          name: tec,
          data: entradaJson.map(mes => Number(mes[tec] || 0)),
          color: getColorForTechnology(tec)
        }));
        const totalPorMes = entradaJson.map((item, idx) => {
          const total = tecnologias.reduce((sum, tec) => sum + (Number(item[tec]) || 0), 0);
          return {
            x: idx,
            y: total,
            dataLabels: {
              enabled: true,
              format: '{y:.2f}',
              style: { color: tokens.colors.text.primary, textOutline: 'none', fontWeight: 'bold' },
              verticalAlign: 'bottom'
            },
            color: 'transparent'
          };
        });

        opts.push(withHeight({
          chart: { type: 'column', backgroundColor: tokens.colors.surface.primary },
          title: { text: 'Capacidad entrante por mes', align: 'left' },
          subtitle: { text: '' },
          legend: { itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
          xAxis: {
            categories: meses,
            tickInterval: 1,
            title: { text: 'Mes', style: { color: '#ccc' } },
            labels: { style: { color: '#ccc', fontSize: '12px' }, step: 1, rotation: -45, autoRotation: false },
            gridLineColor: '#333'
          },
          yAxis: {
            title: { text: 'Capacidad (MW)', style: { color: '#ccc' } },
            labels: { style: { color: '#ccc', fontSize: '12px' } },
            tickAmount: 5,
            gridLineColor: '#333'
          },
          plotOptions: { column: { stacking: 'normal', borderWidth: 0, dataLabels: { enabled: false } } },
          series: [
            ...seriesData,
            { name: 'Total', type: 'scatter', marker: { enabled: false }, data: totalPorMes, enableMouseTracking: false }
          ],
          tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: tokens.colors.surface.primary,
            borderColor: '#666',
            padding: 10,
            formatter: stackedColumnTooltipFormatter({ unit: 'MW' })
          },
          exporting: { enabled: true }
        }));

        // 4) Columnas apiladas histórico anual – altura uniforme
        const years = Object.keys(matJson[0]).filter(k => k !== 'fuente');
        opts.push({
          chart: { type: 'column', height: 350, backgroundColor: tokens.colors.surface.primary },
          title: { text: 'Evolución anual matriz energética despachada centralmente', align: 'left' },
          subtitle: { text: '' },
          legend: { itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
          xAxis: {
            categories: years,
            tickInterval: 1,
            labels: { style: { color: '#ccc', fontSize: '12px' } },
            title: { text: 'Año', style: { color: '#ccc' } },
            gridLineColor: '#333'
          },
          yAxis: {
            title: { text: 'Capacidad Instalada (GW)', style: { color: '#ccc' } },
            labels: { style: { color: '#ccc', fontSize: '12px' } },
            tickAmount: 6,
            gridLineColor: '#333'
          },
          plotOptions: { column: { stacking: 'normal', borderWidth: 0 } },
          series: matJson.map(row => ({
            name: row.fuente,
            data: years.map(y => Number(row[y] ?? 0)),
            color: getColorForTechnology(row.fuente)
          })),
          tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: tokens.colors.surface.primary,
            borderColor: '#666',
            padding: 10,
            formatter: stackedColumnTooltipFormatter({ unit: 'MW' })
          },
          exporting: { enabled: true }
        });

        return opts;
      } catch (err) {
        console.error('Error:', err);
        return [];
      }
  }, [techJson, catJson, entradaJson, matJson]);

  // Reflow de gráficos cuando cambien
  useMemo(() => {
    if (charts.length > 0) {
      setTimeout(() => {
        chartRefs.current.forEach(ref => { if (ref && ref.chart) ref.chart.reflow(); });
      }, 200);
    }
  }, [charts]);

  if (loading || loadingTooltips) {
    return (
      <div className="bg-surface-primary p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[500px]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráficas resumen...</p>
      </div>
    );
  }

  if (error || errorTooltips) {
    return (
      <div className="bg-surface-primary p-4 rounded-lg border shadow flex flex-col items-center justify-center h-[500px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-500 text-center max-w-md">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  const isFiltered = selected !== 'all';
  const gridClasses = isFiltered ? 'grid-cols-1 lg:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
  const displayed = charts.map((opt, idx) => ({ opt, idx }))
    .filter(item => selected === 'all' || String(item.idx) === selected);

  return (
    <section className="mt-8">
      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => (
          <div
            key={idx}
            className="bg-surface-primary p-4 rounded-lg border border-[color:var(--border-default)] shadow relative"
            style={{ minHeight: CHART_HEIGHT + 32 }} // asegura tarjetas iguales
          >
            <button
              className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
              style={{ width: 30, height: 30 }}
              title="Ayuda"
              onClick={() => handleHelpClick(idx, opt)}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
                <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
                <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold" fontFamily="Nunito Sans, sans-serif" pointerEvents="none">?</text>
              </svg>
            </button>

            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              ref={el => (chartRefs.current[idx] = el)}
              containerProps={{ style: { height: CHART_HEIGHT, width: '100%' } }} // altura uniforme en el contenedor
            />
          </div>
        ))}
      </div>
      {/* *** COMPONENTE TOOLTIP MODAL *** */}
      <TooltipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalContent}
      />
    </section>
  );
}

export default ResumenCharts;




