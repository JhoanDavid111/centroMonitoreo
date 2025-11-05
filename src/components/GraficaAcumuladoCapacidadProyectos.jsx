// src/components/GraficaAcumuladoCapacidadProyectos.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import { useAcumuladoCapacidadProyectos } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';

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

  return (
    <ChartWrapper
      options={options}
      isLoading={loading}
      error={error}
      chartTitle="Acumulado de Capacidad por Tipo de Proyecto"
      loadingMessage="Cargando gráfica..."
      height={350}
      chartRef={chartRef}
    />
  );
}

export default GraficaAcumuladoCapacidadProyectos;
