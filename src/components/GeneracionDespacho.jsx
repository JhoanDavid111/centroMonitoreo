// src/components/GeneracionDespacho.jsx
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ExportData from 'highcharts/modules/export-data';
import Exporting from 'highcharts/modules/exporting';
import FullScreen from 'highcharts/modules/full-screen';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGeneracionDiaria } from '../services/graficasService';
import { useTooltips } from '../services/tooltipsService';
import TooltipModal from './ui/TooltipModal';

// Mapeo Canónico para Tooltip
const CHART_TOOLTIP_ID='res_grafica_generacion_real_diaria_tecnologia'


// ─────────── Carga de módulos Highcharts ───────────
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema global
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
  },
  title: {
    align: 'left',
    style: { color: '#fff', fontFamily: 'Nunito Sans, sans-serif' }
  },
  subtitle: {
    style: { color: '#aaa', fontFamily: 'Nunito Sans, sans-serif' }
  },
  xAxis: {
    labels: {
      style: { color: '#ccc', fontSize: '14px', fontFamily: 'Nunito Sans, sans-serif' },
      rotation: -45,
      align: 'right'
    },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '14px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  }
});

// ─────────── Helpers tooltip ───────────
const fmt = (v, dec = 2) => Highcharts.numberFormat(v, dec, ',', '.');

function areaTooltipFormatter() {
  const pts = this.points || [];
  const total = pts.reduce((s, p) => s + p.y, 0);
  const rows = pts
    .map(
      (p) => `
    <tr>
      <td style="padding:4px 8px 4px 0; white-space:nowrap;">
        <span style="color:${p.series.color}; fontSize:20px;">● </span>${p.series.name}:
      </td>
      <td style="text-align:right;"><b>${fmt(p.y, 2)} MWh-día</b></td>
    </tr>
  `
    )
    .join('');
  return `
    <span style="font-size:12px"><b>${this.x}</b></span>
    <table>${rows}
      <tr>
        <td colspan="2" style="border-top:1px solid #555; padding-top:8px">
          Total: <b style="fontSize: 13px;">${fmt(total, 2)} MWh-día</b>
        </td>
      </tr>
    </table>
  `;
}

export function GeneracionDespacho() {
  const chartRef = useRef(null);
  
  // Estados para modal/tooltips
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // Hooks de React Query
  const { data, isLoading: loading, error } = useGeneracionDiaria();
  const { data: tooltips = {}, isLoading: loadingTooltips, error: errorTooltips } = useTooltips();

//Funccion para cerrar la modal
const closeModal=()=>{
  setIsModalOpen(false);
  setModalTitle('');
  setModalContent('');
};

  // Función para manejar el clic en el botón de ayuda
  const handleHelpClick = () => {
    const title = 'Generación real diaria por tecnología';
    const content = tooltips[CHART_TOOLTIP_ID];
    
    if (content) {
      setModalTitle(title);
      setModalContent(content);
      setIsModalOpen(true);
    } else {
      setModalTitle('Información no disponible');
      setModalContent(`No se encontró una descripción detallada para esta gráfica. (Clave: ${CHART_TOOLTIP_ID})`);
      setIsModalOpen(true);
    }
  };

  // Procesar datos con useMemo
  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    // Ordenar por fecha
    const sorted = [...data].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const categories = sorted.map(item => item.fecha.slice(0, 10));

    // Mostrar aprox. 12 labels en X
    const tickInt = Math.max(1, Math.ceil(categories.length / 12));

    // Series
    const techs = ['TERMICA', 'COGENERADOR', 'HIDRAULICA', 'SOLAR', 'EOLICA'];
    const colorMap = {
      EOLICA: '#5DFF97',
      SOLAR: '#FFC800',
      HIDRAULICA: '#3B82F6',
      COGENERADOR: '#D1D1D0',
      TERMICA: '#F97316'
    };

    const series = techs.map((tech, idx) => ({
      name: tech,
      data: categories.map(date => {
        const rec = sorted.find(d => d.fecha.slice(0, 10) === date);
        return rec && rec[tech] != null ? Number(rec[tech]) : 0;
      }),
      color: colorMap[tech],
      index: idx,
      legendIndex: idx
    }));

    return {
      chart: { type: 'area', height: 400, backgroundColor: '#262626' },
      title: { text: 'Generación real diaria por tecnología' },
      subtitle: { text: '' },
      legend: { itemStyle: { fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
      xAxis: {
        categories,
        tickInterval: tickInt,
        title: { text: 'Fecha', style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' } },
        labels: { rotation: -45, style: { color: '#CCC', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' } }
      },
      yAxis: {
        title: { text: 'Generación (MWh-día)', style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
        labels: { style: { color: '#CCC', fontFamily: 'Nunito Sans, sans-serif', fontSize: '12px' } },
        min: 0,
        gridLineColor: '#333'
      },
      plotOptions: {
        area: { stacking: 'normal', marker: { enabled: false } }
      },
      series,
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: '#262626',
        borderColor: '#666',
        formatter: areaTooltipFormatter
      },
      exporting: { enabled: true }
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
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-[450px]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráfica de Generación Real Diaria por Tecnología...</p>
      </div>
    );
  }

  if (error || errorTooltips) {
    return (
      <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[450px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-500 mb-4">{error?.message || errorTooltips?.message || 'Error al cargar la gráfica'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FFC800] hover:bg-[#FFD700] rounded text-[#262626] font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!options) return null;

  return (
    <section className="mt-8">
      <div className="w-full bg-[#262626] p-4 rounded-lg border border-[#666666] shadow relative">
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={handleHelpClick}
          
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
            <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
            <text
              x="12"
              y="18"
              textAnchor="middle"
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              fontFamily="Nunito Sans, sans-serif"
              pointerEvents="none"
            >?</text>
          </svg>
        </button>

        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </div>
      {/***componente modal */}
      <TooltipModal 
      isOpen={isModalOpen}
      onClose={closeModal}
      title={modalTitle}
      content={modalContent}
      />
      


    </section>
  );
}

export default GeneracionDespacho;
