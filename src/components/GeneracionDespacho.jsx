// src/components/GeneracionDespacho.jsx
import Highcharts from '../lib/highcharts-config';
import { useMemo, useRef } from 'react';
import { useGeneracionDiaria } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';
import { getColorForTechnology } from '../lib/chart-colors';
import { areaTooltipFormatter } from '../lib/chart-tooltips';
import tokens from '../styles/theme.js';

// Mapeo Canónico para Tooltip
const CHART_TOOLTIP_ID = 'res_grafica_generacion_real_diaria_tecnologia';

// ✅ Menú de exportación con estilo oscuro (botón + dropdown) — igual a los otros componentes
const COMMON_EXPORTING = {
  enabled: true,
  buttons: {
    contextButton: {
      align: 'right',
      verticalAlign: 'top',
      symbol: 'menu',
      symbolStroke: '#FFFFFF',
      symbolStrokeWidth: 2,
      symbolSize: 14,
      theme: {
        fill: '#444444', // botón gris
        stroke: 'none',
        r: 8,
        style: { color: '#FFFFFF', cursor: 'pointer', fontFamily: 'Nunito Sans, sans-serif' },
        states: { hover: { fill: '#666666' }, select: { fill: '#666666' } },
      },
    },
  },
  menuStyle: {
    background: '#444444',
    border: '1px solid #666666',
    borderRadius: '10px',
    padding: '6px',
  },
  menuItemStyle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '12px',
    padding: '8px 10px',
  },
  menuItemHoverStyle: {
    background: '#666666',
    color: '#FFFFFF',
  },
};

export function GeneracionDespacho() {
  const chartRef = useRef(null);

  // Hooks de React Query
  const { data, isLoading: loading, error } = useGeneracionDiaria();

  // Procesar datos con useMemo
  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    // Ordenar por fecha
    const sorted = [...data].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const categories = sorted.map((item) => item.fecha.slice(0, 10));

    // Mostrar aprox. 12 labels en X
    const tickInt = Math.max(1, Math.ceil(categories.length / 12));

    // Series
    const techs = ['TERMICA', 'COGENERADOR', 'HIDRAULICA', 'SOLAR', 'EOLICA'];

    const series = techs.map((tech, idx) => ({
      name: tech,
      data: categories.map((date) => {
        const rec = sorted.find((d) => d.fecha.slice(0, 10) === date);
        return rec && rec[tech] != null ? Number(rec[tech]) : 0;
      }),
      color: getColorForTechnology(tech),
      index: idx,
      legendIndex: idx,
    }));

    return {
      chart: { type: 'area', height: 400 },
      title: { text: 'Generación real diaria por tecnología' },
      subtitle: { text: '' },
      legend: { itemStyle: { fontSize: tokens.font.size.sm, fontFamily: tokens.font.family } },
      xAxis: {
        categories,
        tickInterval: tickInt,
        title: {
          text: 'Fecha',
          style: { color: tokens.colors.text.secondary, fontFamily: tokens.font.family, fontSize: tokens.font.size.sm },
        },
        labels: {
          rotation: -45,
          style: { color: tokens.colors.text.secondary, fontFamily: tokens.font.family, fontSize: tokens.font.size.sm },
        },
      },
      yAxis: {
        title: { text: 'Generación (MWh-día)', style: { color: tokens.colors.text.secondary, fontFamily: tokens.font.family } },
        labels: { style: { color: tokens.colors.text.secondary, fontFamily: tokens.font.family, fontSize: tokens.font.size.sm } },
        min: 0,
        gridLineColor: tokens.colors.border.subtle,
      },
      plotOptions: {
        area: { stacking: 'normal', marker: { enabled: false } },
      },
      series,
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: areaTooltipFormatter({ unit: 'MWh-día', headerFormat: '{x}' }),
      },

      credits: { enabled: false },
      // ✅ mismo estilo del menú (botón gris + menú gris)
      exporting: { ...COMMON_EXPORTING },
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
