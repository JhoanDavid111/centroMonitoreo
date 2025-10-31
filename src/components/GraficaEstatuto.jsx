// src/components/GraficaEstatuto.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGraficaEstatuto } from '../services/graficasService';

export function GraficaEstatuto({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const chartRef = useRef(null);
  const { data, isLoading: loading, error } = useGraficaEstatuto(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.fecha);
    const dataVolumen = data.map((d) => d['Volumen útil del embalse']);
    const dataPrecioPunta = data.map((d) => d['Precio de Bolsa en Períodos Punta']);

    return {
      chart: {
        zoomType: '',
        height: 350
      },
      title: {
        text: 'Volumen útil del embalse (diario)',
        align: 'left'
      },
      subtitle: {
        text: `Fuente: API. ${fechaInicio} → ${fechaFin}`,
        align: 'left'
      },
      xAxis: {
        categories,
        title: { text: 'Fecha' }
      },
      yAxis: [
        {
          title: { text: 'Volumen útil (GWh)' },
          labels: { style: { color: '#3B82F6' } }
        },
        {
          title: { text: 'Precio (COP)' },
          opposite: true,
          labels: { style: { color: '#FFC800' } }
        }
      ],
      series: [
        {
          name: 'Volumen útil',
          data: dataVolumen,
          type: 'column',
          color: '#3B82F6',
          yAxis: 0
        },
        {
          name: 'Precio Punta',
          data: dataPrecioPunta,
          type: 'line',
          color: '#FFC800',
          yAxis: 1
        }
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
        <p className="text-gray-300 mt-4">Cargando gráfica de estatuto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-500">{error.message || 'No fue posible cargar la gráfica de estatuto.'}</p>
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

export default GraficaEstatuto;
