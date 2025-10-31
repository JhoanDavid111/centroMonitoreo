// src/components/GraficaCapacidadInstaladaTecnologia.jsx
import React, { useMemo, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGraficaCapacidadInstaladaTecnologia } from '../services/graficasService';
import { useTooltips } from '../services/tooltipsService';
import TooltipModal from './ui/TooltipModal';

const CHART_TOOLTIP_ID = 'res_grafica_capacidad_instalada_tecnologia';

export function GraficaCapacidadInstaladaTecnologia({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const chartRef = useRef(null);
  const { data, isLoading: loading, error } = useGraficaCapacidadInstaladaTecnologia(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );
  const { data: tooltips = {}, isLoading: loadingTooltips, error: errorTooltips } = useTooltips();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

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
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.fuente);
    const valores = data.map((d) => {
      const key = Object.keys(d).find((k) => k !== 'fuente');
      return d[key];
    });

    return {
      chart: { type: 'column', height: 350 },
      title: { text: 'Capacidad instalada por tecnología', align: 'left'},
      subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`,align: 'left' },
      xAxis: { categories, title: { text: 'Fuente' } },
      yAxis: { title: { text: 'Capacidad (GW)' } },
      series: [
        { name: 'Capacidad inst.', data: valores, color: '#FFC800' }
      ],
    };
  }, [data, fechaInicio, fechaFin]);

  if (loading || loadingTooltips) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráfica de capacidad instalada...</p>
      </div>
    );
  }

  if (error || errorTooltips) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-500">{error?.message || errorTooltips?.message || 'Error al cargar la gráfica.'}</p>
      </div>
    );
  }

  if (!options) return null;

  return (
    <>
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow relative">
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={handleHelpClick}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
            <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
            <text x="12" y="16" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold" fontFamily="Nunito Sans, sans-serif" pointerEvents="none">?</text>
          </svg>
        </button>
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </div>
      <TooltipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalContent}
      />
    </>
  );
}

export default GraficaCapacidadInstaladaTecnologia;
