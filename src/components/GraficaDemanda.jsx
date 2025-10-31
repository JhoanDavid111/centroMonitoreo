// src/components/GraficaDemanda.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGraficaDemanda } from '../services/graficasService';

export function GraficaDemanda({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const chartRef = useRef(null);
  const { data, isLoading: loading, error } = useGraficaDemanda(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.fecha);
    const dataDemCom = data.map((d) => d['Demanda Comercial por Sistema']);
    const dataEnerFirm = data.map((d) => d['Energía en Firme Cargo por Confiabilidad']);
    const dataObligOEF = data.map((d) => d['Obligación de Energía en Firme']);

    return {
      chart: { type: 'line', height: 350 },
      title: { text: 'Demanda vs Energía en Firme',align: 'left' },
      subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`, align: 'left' },
      xAxis: { categories, title: { text: 'Fecha' } },
      yAxis: { title: { text: 'Cantidad' } },
      series: [
        { name: 'Demanda Comercial', data: dataDemCom, color: '#FFC800' },
        { name: 'Energía en Firme', data: dataEnerFirm, color: '#3B82F6' },
        { name: 'Obligación OEF', data: dataObligOEF, color: '#F97316' }
      ],
    };
  }, [data, fechaInicio, fechaFin]);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300 mt-4">Cargando gráfica de demanda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-500">{error.message || 'No fue posible cargar la gráfica de demanda.'}</p>
      </div>
    );
  }

  if (!options) return null;

  return (
    <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow relative">
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
}

export default GraficaDemanda;
