// src/components/GraficaVolumenUtilRegion.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGraficaVolumenUtilRegion } from '../services/graficasService';

export function GraficaVolumenUtilRegion({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const chartRef = useRef(null);
  const { data, isLoading: loading, error } = useGraficaVolumenUtilRegion(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    // data: [{ region: "...", "2025-05": número }, ...]
    const categories = data.map((d) => d.region);
    const valores = data.map((d) => {
      // Obtenemos la única clave distinta de "region"
      const key = Object.keys(d).find((k) => k !== 'region');
      return d[key];
    });

    return {
      chart: { type: 'column', height: 350 },
      title: { text: 'Volumen útil por región (mes)', align: 'left' },
      subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}`, align: 'left' },
      xAxis: { categories, title: { text: 'Región' } },
      yAxis: { title: { text: 'Volumen útil (GWh)' } },
      series: [{ name: 'Volumen útil', data: valores, color: '#3B82F6' }],
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

export default GraficaVolumenUtilRegion;
