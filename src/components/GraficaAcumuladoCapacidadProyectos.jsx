// src/components/GraficaAcumuladoCapacidadProyectos.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useAcumuladoCapacidadProyectos } from '../services/graficasService';

export function GraficaAcumuladoCapacidadProyectos() {
  const chartRef = useRef(null);
  const { data, isLoading: loading, error } = useAcumuladoCapacidadProyectos();

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    // Agrupamos por tipo_proyecto_fuente
    const fuentesMap = {};
    data.forEach((d) => {
      if (!fuentesMap[d.tipo_proyecto_fuente]) {
        fuentesMap[d.tipo_proyecto_fuente] = { acumulado: 0, cantidad: 0 };
      }
      fuentesMap[d.tipo_proyecto_fuente].acumulado += Number(d.capacidad_acumulada || 0);
      fuentesMap[d.tipo_proyecto_fuente].cantidad += Number(d.numero_proyectos || 0);
    });

    const categorias = Object.keys(fuentesMap);
    const acumulados = categorias.map((f) => fuentesMap[f].acumulado);
    const cantidades = categorias.map((f) => fuentesMap[f].cantidad);

    return {
      chart: { type: 'column', height: 350 },
      title: { text: 'Acumulado de Capacidad por Tipo de Proyecto', align: 'left' },
      xAxis: { categories: categorias, title: { text: 'Tipo de Proyecto' } },
      yAxis: [
        { title: { text: 'Capacidad Acumulada (MW)' }, min: 0 },
        { title: { text: 'Número de Proyectos' }, opposite: true, min: 0 }
      ],
      series: [
        { name: 'Capacidad Acumulada', data: acumulados, type: 'column', color: '#FFC800', yAxis: 0 },
        { name: 'Número de Proyectos', data: cantidades, type: 'line', color: '#3B82F6', yAxis: 1 }
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

export default GraficaAcumuladoCapacidadProyectos;
