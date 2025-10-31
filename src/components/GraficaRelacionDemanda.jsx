// src/components/GraficaRelacionDemanda.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGraficaRelacionDemanda } from '../services/graficasService';

export function GraficaRelacionDemanda({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const chartRef = useRef(null);
  const { data, isLoading: loading, error } = useGraficaRelacionDemanda(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.fecha);
    const dataOEF = data.map((d) => d['Relacion Demanda Comercial / OEF']);
    const dataEFICC = data.map((d) => d['Relacion Demanda Comercial / EFICC']);

    return {
      chart: { type: 'line', height: 350 },
      title: { text: 'Relación Demanda / Firme',align: 'left' },
      subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`,align: 'left' },
      xAxis: { categories, title: { text: 'Fecha' } },
      yAxis: { title: { text: 'Ratio' } },
      series: [
        { name: 'Dem / OEF', data: dataOEF, color: '#FFC800' },
        { name: 'Dem / EFICC', data: dataEFICC, color: '#4CAF50' }
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
        <p className="text-gray-300 mt-4">Cargando gráfica...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-500">{error.message || 'Error al cargar la gráfica.'}</p>
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

export default GraficaRelacionDemanda;
