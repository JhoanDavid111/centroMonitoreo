import tokens from '../styles/theme.js';

// src/components/GraficaCapacidadPorcentajeAvanceCurvaS.jsx
import React, { useMemo, useRef } from 'react';
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import { useCapacidadPorcentajeAvanceCurvaS } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';

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
        { title: { text: 'Capacidad instalada (MW)' }, labels: { style: { color: tokens.colors.accent.primary } }, gridLineColor: '#333333' },
        { title: { text: 'Número de proyectos' }, opposite: true, labels: { style: { color: '#4CAF50' } }, gridLineColor: '#333333' }
      ],
      series: [
        { name: 'Capacidad instalada', data: dataCapacidad, type: 'column', yAxis: 0, color: tokens.colors.accent.primary },
        { name: 'Número de proyectos', data: dataProyectos, type: 'line', yAxis: 1, color: '#4CAF50' }
      ],
    };
  }, [data]);

  return (
    <ChartWrapper
      options={options}
      isLoading={loading}
      error={error}
      chartTitle="Capacidad instalada vs % de avance"
      loadingMessage="Cargando gráfica de curva S..."
      height={350}
      chartRef={chartRef}
    />
  );
}

export default GraficaCapacidadPorcentajeAvanceCurvaS;
