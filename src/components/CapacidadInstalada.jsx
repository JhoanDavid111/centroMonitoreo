// src/components/CapacidadInstalada.jsx
import Highcharts from '../lib/highcharts-config';
import { useEffect, useMemo, useRef } from 'react';
import { useAcumuladoCapacidadProyectos } from '../services/graficasService';
import ChartWrapper from './charts/ChartWrapper';
import { getColorForTechnology } from '../lib/chart-colors';
import { stackedAreaTooltipFormatter } from '../lib/chart-tooltips';

// ────────────────────────────────────────────────
// Mapeo Canónico para Tooltip
// ────────────────────────────────────────────────
const CHART_TOOLTIP_ID = 'res_grafica_capacidad_instalada_tecnologia';

// normaliza string (mayúsculas, sin tildes)
const norm = (s = '') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

export function CapacidadInstalada() {
  const chartRef = useRef(null);

  // Hooks de React Query
  const { data, isLoading: loading, error } = useAcumuladoCapacidadProyectos();

  const options = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    // ordena por fecha
    const sorted = [...data].sort(
      (a, b) => new Date(a.fecha_entrada_operacion) - new Date(b.fecha_entrada_operacion)
    );

    // Fuentes detectadas dinámicamente (quitamos Biomasa)
    const fuentesAll = Object.keys(sorted[0]).filter(k => k !== 'fecha_entrada_operacion');
    const fuentesSinBiomasa = fuentesAll.filter(k => norm(k) !== 'BIOMASA');

    // ORDEN deseado en la pila
    const pchKey = fuentesSinBiomasa.find(f => norm(f) === 'PCH');
    const eolicaKey = fuentesSinBiomasa.find(f => norm(f).includes('EOLICA') || norm(f).includes('EOLICO') || norm(f).includes('VIENTO'));
    const solarKey = fuentesSinBiomasa.find(f => norm(f).includes('SOLAR'));

    const middle = fuentesSinBiomasa.filter(f =>
      f !== pchKey && f !== eolicaKey && f !== solarKey
    );

    const orderedFuentes = [
      ...(pchKey ? [pchKey] : []),
      ...(eolicaKey ? [eolicaKey] : []),
      ...middle,
      ...(solarKey ? [solarKey] : []),
    ];

    // crea series acumuladas [timestamp, valor]
    const series = orderedFuentes.map(fuente => {
      let last = 0;
      const points = sorted.map(item => {
        const t = new Date(item.fecha_entrada_operacion).getTime();
        if (item[fuente] !== undefined && !isNaN(item[fuente])) {
          last = parseFloat(item[fuente]);
        }
        return [t, last];
      });
      return {
        name: fuente,
        data: points,
        color: getColorForTechnology(fuente),
      };
    });

    return {
      chart: {
        type: 'area',
        backgroundColor: '#262626',
        height: 550,
        marginBottom: 100,
      },
      title: {
        text: 'Evolución capacidad instalada por tecnología',
        align: 'left',
        style: { fontFamily: 'Nunito Sans, sans-serif', fontSize: '16px' }
      },
      subtitle: {
        text: '',
        style: { color: '#AAA', fontSize: '12px' }
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { day: '%e %b %Y', month: "%b '%y", year: '%Y' },
        labels: { rotation: -45, y: 18, style: { color: '#CCC', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' } },
        title: { text: 'Fecha de entrada en operación', style: { color: '#FFF' } },
        lineColor: '#555', tickColor: '#888', tickLength: 5
      },
      yAxis: {
        min: 0,
        tickAmount: 6,
        gridLineDashStyle: 'Dash',
        gridLineColor: '#444',
        reversedStacks: false,
        title: { text: 'Capacidad acumulada (MW)', style: { color: '#FFF' } },
        labels: {
          formatter() { return this.value.toLocaleString() + ' MW'; },
          style: { color: '#CCC', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' }
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: stackedAreaTooltipFormatter({ unit: 'MW', dateFormat: '%e %b %Y' }),
      },
      plotOptions: {
        area: { stacking: 'normal', marker: { enabled: false }, lineWidth: 1 }
      },
      series,
      legend: {
        layout: 'horizontal',
        verticalAlign: 'bottom',
        y: 25,
        itemStyle: { color: '#ccc', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
        itemHoverStyle: { color: '#fff' }
      }
    };
  }, [data]);

  // Reflow cuando cambien los datos
  useEffect(() => {
    if (options && chartRef.current?.chart) {
      setTimeout(() => {
        chartRef.current?.chart?.redraw();
      }, 200);
    }
  }, [options]);

  return (
    <section className="mt-8 mb-14">
      <ChartWrapper
        options={options}
        isLoading={loading}
        error={error}
        tooltipId={CHART_TOOLTIP_ID}
        chartTitle="Evolución capacidad instalada por tecnología"
        loadingMessage="Cargando capacidad instalada..."
        height={550}
        chartRef={chartRef}
      />
    </section>
  );
}

export default CapacidadInstalada;

