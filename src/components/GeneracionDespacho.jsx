// src/components/GeneracionDespacho.jsx
import Highcharts from '../lib/highcharts-config';
import { useMemo, useRef } from 'react';
import { useGeneracionDiaria } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';
import { getColorForTechnology } from '../lib/chart-colors';
import { areaTooltipFormatter } from '../lib/chart-tooltips';

// Mapeo Canónico para Tooltip
const CHART_TOOLTIP_ID = 'res_grafica_generacion_real_diaria_tecnologia';

export function GeneracionDespacho() {
  const chartRef = useRef(null);

  // Hooks de React Query
  const { data, isLoading: loading, error } = useGeneracionDiaria();

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

    const series = techs.map((tech, idx) => ({
      name: tech,
      data: categories.map(date => {
        const rec = sorted.find(d => d.fecha.slice(0, 10) === date);
        return rec && rec[tech] != null ? Number(rec[tech]) : 0;
      }),
      color: getColorForTechnology(tech),
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
        formatter: areaTooltipFormatter({ unit: 'MWh-día', headerFormat: '{x}' }),
      },
      exporting: { enabled: true }
    };
  }, [data]);

  return (
    <section className="mt-8">
      <ChartWrapper
        options={options}
        isLoading={loading}
        error={error}
        tooltipId={CHART_TOOLTIP_ID}
        chartTitle="Generación real diaria por tecnología"
        loadingMessage="Cargando gráfica de Generación Real Diaria por Tecnología..."
        height={400}
        chartRef={chartRef}
        onRetry={() => window.location.reload()}
      />
    </section>
  );
}

export default GeneracionDespacho;
