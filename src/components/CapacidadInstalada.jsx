// src/components/CapacidadInstalada.jsx
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ExportData from 'highcharts/modules/export-data';
import Exporting from 'highcharts/modules/exporting';
import FullScreen from 'highcharts/modules/full-screen';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAcumuladoCapacidadProyectos } from '../services/graficasService';
import { useTooltips } from '../services/tooltipsService';
import TooltipModal from './ui/TooltipModal';

// ────────────────────────────────────────────────
// Mapeo Canónico para Tooltip
// Este identificador debe coincidir con la clave retornada por tu API de tooltips
// ────────────────────────────────────────────────
const CHART_TOOLTIP_ID = 'res_grafica_capacidad_instalada_tecnologia'; // EJEMPLO: Ajusta esta clave si es necesario


// ============== Highcharts mods ==============
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// normaliza string (mayúsculas, sin tildes)
const norm = (s='') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

// color por fuente (robusto a variantes)
const colorFor = (name='') => {
  const n = norm(name);
  if (n.includes('SOLAR')) return '#FFC800';
  if (n.includes('EOLICA') || n.includes('EOLICO') || n.includes('VIENTO')) return '#5DFF97';
  if (n === 'PCH') return '#3B82F6';
  if (n.includes('TERM')) return '#F97316';
  if (n.includes('BIOMASA')) return '#B39FFF';
  return '#666666';
};

export function CapacidadInstalada() {
  const chartRef = useRef(null);
  
  // Estados para modal/tooltips
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // Hooks de React Query
  const { data, isLoading: loading, error } = useAcumuladoCapacidadProyectos();
  const { data: tooltips = {}, isLoading: loadingTooltips, error: errorTooltips } = useTooltips();

  // Función para cerrar la modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent('');
  };

  const handleHelpClick = () => {
    const title = 'Capacidad instalada por tecnología';
    const content = tooltips[CHART_TOOLTIP_ID];

    if (content) {
      setModalTitle(title);
      setModalContent(content);
      setIsModalOpen(true);
    } else {
      setModalTitle('Información no disponible');
      setModalContent('No se encontró una descripción detallada para esta gráfica.');
      setIsModalOpen(true);
    }
  };

  const options = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    // ordena por fecha
    const sorted = [...data].sort(
      (a, b) => new Date(a.fecha_entrada_operacion) - new Date(b.fecha_entrada_operacion)
    );

    // Fuentes detectadas dinámicamente (quitamos Biomasa)
    const fuentesAll = Object.keys(sorted[0]).filter(k => k !== 'fecha_entrada_operacion');
    const fuentesSinBiomasa = fuentesAll.filter(k => norm(k) !== 'BIOMASA');

    // ORDEN deseado en la pila
    const pchKey = fuentesSinBiomasa.find(f => norm(f) === 'PCH');
    const eolicaKey = fuentesSinBiomasa.find(f => norm(f).includes('EOLICA') || norm(f).includes('EOLICO') || norm(f).includes('VIENTO'));
    const solarKey = fuentesSinBiomasa.find(f => norm(f).includes('SOLAR'));

    const middle = fuentesSinBiomasa.filter(f =>
      f !== pchKey && f !== eolicaKey && f !== solarKey
    );

    const orderedFuentes = [
      ...(pchKey ? [pchKey] : []),
      ...(eolicaKey ? [eolicaKey] : []),
      ...middle,
      ...(solarKey ? [solarKey] : []),
    ];

    // crea series acumuladas [timestamp, valor]
    const series = orderedFuentes.map(fuente => {
      let last = 0;
      const points = sorted.map(item => {
        const t = new Date(item.fecha_entrada_operacion).getTime();
        if (item[fuente] !== undefined && !isNaN(item[fuente])) {
          last = parseFloat(item[fuente]);
        }
        return [t, last];
      });
      return {
        name: fuente,
        data: points,
        color: colorFor(fuente),
      };
    });

    return {
      chart: {
        type: 'area',
        backgroundColor: '#262626',
        height: 550,
        marginBottom: 100,
      },
      title: {
        text: 'Evolución capacidad instalada por tecnología',
        align: 'left',
        style: { fontFamily: 'Nunito Sans, sans-serif', fontSize: '16px' }
      },
      subtitle: {
        text: '',
        style: { color: '#AAA', fontSize: '12px' }
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { day: '%e %b %Y', month: "%b '%y", year: '%Y' },
        labels: { rotation: -45, y: 18, style: { color: '#CCC', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
        title: { text: 'Fecha de entrada en operación', style: { color: '#FFF' } },
        lineColor: '#555', tickColor: '#888', tickLength: 5
      },
      yAxis: {
        min: 0,
        tickAmount: 6,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#444',
        reversedStacks: false,
        title: { text: 'Capacidad acumulada (MW)', style: { color: '#FFF' } },
        labels: {
          formatter() { return this.value.toLocaleString() + ' MW'; },
          style: { color: '#CCC', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' }
        }
      },
      tooltip: {
        backgroundColor: '#262626',
        style: { color: '#FFF', fontSize: '14px' },
        shared: true,
        formatter() {
          const fecha = Highcharts.dateFormat('%e %b %Y', this.x);
          let total = 0;
          this.points.forEach((pt) => {
            total += pt.y;
          });
          let s = `<b>Fecha: ${fecha}</b><br/><br/>`;
          this.points.forEach((pt) => {
            s += `<span style="color:${pt.color}; fontSize:20px;">● </span> ${pt.series.name}: <b>${pt.y.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MW</b><br/><br/>`;
          });
          s += `<span style="border-top:1px solid #555; padding-top:8px; width: 100%;"><b>Total: ${total.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MW</b></span><br/><br/>`;
          return s;
        },
      },
      plotOptions: {
        area: { stacking: 'normal', marker: { enabled: false }, lineWidth: 1 }
      },
      series,
      legend: {
        layout: 'horizontal',
        verticalAlign: 'bottom',
        y: 25,
        itemStyle: { color: '#ccc', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
        itemHoverStyle: { color: '#fff' }
      }
    };
  }, [data]);

  // Reflow cuando cambien los datos
  useEffect(() => {
    if (options && chartRef.current?.chart) {
      setTimeout(() => {
        chartRef.current?.chart?.redraw();
      }, 200);
    }
  }, [options]);

  if (loading || loadingTooltips) {
    return (
      <div className="w-full bg-[#262626] p-4 rounded-lg border-[#666666] shadow flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)' }} />
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }} />
        </div>
        <p className="text-gray-300 mt-4">Cargando capacidad instalada...</p>
      </div>
    );
  }

  if (error || errorTooltips) {
    return (
      <div className="w-full bg-[#262626] p-4 rounded-lg border border-[#666666] shadow flex flex-col items-center justify-center h-64">
        <div className="text-red-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.062 19h13.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.33 16c-.77 1.333.2 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-300 text-center">{error?.message || errorTooltips?.message || 'Error al cargar los datos'}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  if (!options) return null;

  return (
    <section className="mt-8 mb-14">
      <div className="w-full bg-[#262626] p-4 pb-10 rounded-lg border border-[#666666] shadow relative">
        {/* Ayuda */}
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={handleHelpClick}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
            <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
            <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold" fontFamily="Nunito Sans, sans-serif">?</text>
          </svg>
        </button>

        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />

        {/* *** COMPONENTE TOOLTIP MODAL *** */}
        <TooltipModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
          content={modalContent}
        />
      {/* Fin ayuda */}


      </div>
    </section>
  );
}

export default CapacidadInstalada;

