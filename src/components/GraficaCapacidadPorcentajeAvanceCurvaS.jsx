// src/components/GraficaCapacidadPorcentajeAvanceCurvaS.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useCapacidadPorcentajeAvanceCurvaS } from '../services/graficasService';

export function GraficaCapacidadPorcentajeAvanceCurvaS() {
  const chartRef = useRef(null);
  const { data, isLoading: loading, error } = useCapacidadPorcentajeAvanceCurvaS();

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const categories = data.map((d) => d.porcentaje_de_avance);
    const dataCapacidad = data.map((d) => d.suma_capacidad);
    const dataProyectos = data.map((d) => d.numero_proyectos);

    return {
      chart: { type: 'column', height: 350 },
      title: { text: 'Capacidad instalada vs % de avance', align: 'left' },
      subtitle: { text: 'Fuente: XM. 2020-2024', align: 'left' },
      xAxis: { categories, title: { text: 'Porcentaje de avance' } },
      yAxis: [
        { title: { text: 'Capacidad instalada (MW)' }, labels: { style: { color: '#FFC800' } }, gridLineColor: '#333333' },
        { title: { text: 'Número de proyectos' }, opposite: true, labels: { style: { color: '#4CAF50' } }, gridLineColor: '#333333' }
      ],
      series: [
        { name: 'Capacidad instalada', data: dataCapacidad, type: 'column', yAxis: 0, color: '#FFC800' },
        { name: 'Número de proyectos', data: dataProyectos, type: 'line', yAxis: 1, color: '#4CAF50' }
      ],
    };
  }, [data]);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-300">Cargando gráfica de curva S...</p>
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

export default GraficaCapacidadPorcentajeAvanceCurvaS;
