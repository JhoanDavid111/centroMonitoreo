// src/components/GestionProyectosPriorizados.jsx
import { useEffect, useMemo, useRef } from 'react';
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import { useGestionProyectosPriorizados } from '../services/indicadoresAmbientalesService';

// Colores y estilos base
const BG_CARD = '#262626';
const BORDER_CARD = '#666666';
const TEXT_MAIN = '#FFFFFF';
const TEXT_MUTED = '#D1D1D0';

const COLOR_PROYECTOS = '#F8F0C9'; // amarillo suave
const COLOR_TRAMITES = '#22C55E';  // verde intenso

const COLOR_LIME  = '#B8F600';     // no ambiental (o lime de tus gráficos)
const COLOR_GREEN = '#05D80A';     // ambiental

// Menú de exportación con estilo oscuro tipo "opciones"
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
        fill: '#444444',
        stroke: 'none',
        r: 8,
        style: { color: '#FFFFFF', cursor: 'pointer', fontFamily: 'Nunito Sans, sans-serif' },
        states: { hover: { fill: '#666666' }, select: { fill: '#666666' } },
      },
    },
  },
};

// Helper: estilos base para cualquier gráfico
const withBaseChart = (opts, { height = 360 } = {}) => ({
  ...opts,
  chart: { backgroundColor: BG_CARD, spacing: [24, 16, 32, 16], ...(opts.chart || {}), height },
  title: {
    style: { color: TEXT_MAIN, fontWeight: '600', fontSize: '16px', fontFamily: 'Nunito Sans, sans-serif' },
    align: 'left',
    ...(opts.title || {}),
  },
  subtitle: {
    style: { color: TEXT_MUTED, fontSize: '11px', fontFamily: 'Nunito Sans, sans-serif' },
    align: 'left',
    ...(opts.subtitle || {}),
  },
  xAxis: {
    labels: { style: { color: TEXT_MUTED, fontSize: '11px' } },
    lineColor: '#444444',
    tickColor: '#444444',
    ...(opts.xAxis || {}),
  },
  yAxis: {
    gridLineColor: '#333333',
    labels: { style: { color: TEXT_MUTED, fontSize: '11px' } },
    title: { style: { color: TEXT_MUTED, fontSize: '11px' }, ...(opts.yAxis && opts.yAxis.title ? opts.yAxis.title : {}) },
    ...(opts.yAxis || {}),
  },
  legend: {
    itemStyle: { color: TEXT_MUTED, fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
    ...(opts.legend || {}),
  },
  tooltip: {
    backgroundColor: BG_CARD,
    borderColor: BORDER_CARD,
    style: { color: TEXT_MAIN, fontSize: '11px', fontFamily: 'Nunito Sans, sans-serif' },
    ...(opts.tooltip || {}),
  },
  credits: { enabled: false },
  exporting: { ...COMMON_EXPORTING, ...(opts.exporting || {}) },
});

export default function GestionProyectosPriorizados() {
  const chartRefs = useRef([]);

  // ⬅️ Reemplaza fetch manual por React Query + apiClient
  const { data: payload, isLoading: loading, error } = useGestionProyectosPriorizados();

  const { techOptions, capOptions, envOptions, nonEnvOptions } = useMemo(() => {
    if (!payload || !Array.isArray(payload.indicadores)) return {};

    const metaGlobal = payload.metadata_global || {};
    const sourceLabel = `Minenergía – OAAS / Actualizado el: ${(metaGlobal.last_update || '').slice(0, 10)}`;

    const getIndicador = (key) => payload.indicadores.find((i) => i.indicador === key);

    // 1) Por tecnología
    const tech = getIndicador('por_tecnologia');
    let techOptionsLocal = null;
    if (tech) {
      const categories = tech.data.map((d) => d.tecnologia);
      const proyectos  = tech.data.map((d) => d.proyectos);
      const tramites   = tech.data.map((d) => d.tramites);

      techOptionsLocal = withBaseChart(
        {
          chart: { type: 'column' },
          title: { text: tech.metadata?.title || 'Proyectos y trámites solicitados por tecnología' },
          subtitle: {
            text: sourceLabel,
            align: 'left',
            style: { color: '#B0B0B0', fontSize: '11px' },
            y: 30,
          },
          xAxis: { categories, crosshair: true },
          yAxis: { min: 0, title: { text: tech.metadata?.y_axis_title || 'Número de proyectos y trámites' } },
          plotOptions: { column: { borderWidth: 0, pointPadding: 0.2 } },
          series: [
            { name: 'No. Proyectos', data: proyectos, color: COLOR_PROYECTOS },
            { name: 'No. Trámites',  data: tramites,  color: COLOR_TRAMITES  },
          ],
        },
        { height: 360 }
      );
    }

    // 2) Por capacidad
    const cap = getIndicador('por_capacidad');
    let capOptionsLocal = null;
    if (cap) {
      const categories = cap.data.map((d) => d.rango_capacidad);
      const proyectos  = cap.data.map((d) => d.proyectos);
      const tramites   = cap.data.map((d) => d.tramites);

      capOptionsLocal = withBaseChart(
        {
          chart: { type: 'column' },
          title: { text: cap.metadata?.title || 'Proyectos y trámites solicitados por capacidad' },
          subtitle: {
            text: sourceLabel,
            align: 'left',
            style: { color: '#B0B0B0', fontSize: '11px' },
            y: 30,
          },
          xAxis: { categories, crosshair: true },
          yAxis: { min: 0, title: { text: cap.metadata?.y_axis_title || 'Número de proyectos y trámites' } },
          plotOptions: { column: { borderWidth: 0, pointPadding: 0.2 } },
          series: [
            { name: 'No. Proyectos', data: proyectos, color: COLOR_PROYECTOS },
            { name: 'No. Trámites',  data: tramites,  color: COLOR_TRAMITES  },
          ],
        },
        { height: 360 }
      );
    }

    // 3) Entidad ambiental
    const env = getIndicador('por_entidad_ambiental');
    let envOptionsLocal = null;
    if (env) {
      const totalEnv   = env.totales?.tramites ?? null;
      const sorted     = [...env.data].sort((a, b) => a.tramites - b.tramites);
      const categories = sorted.map((d) => d.entidad);
      const values     = sorted.map((d) => d.tramites);

      envOptionsLocal = withBaseChart(
        {
          chart: { type: 'bar', marginLeft: 210 },
          title: { text: env.metadata?.title || 'Trámites por entidad ambiental' },
          subtitle: {
            text: sourceLabel,
            align: 'left',
            style: { color: '#B0B0B0', fontSize: '11px' },
            y: 30,
          },
          xAxis: {
            categories,
            title: { text: null },
            labels: {
              style: { color: '#D1D1D0', fontSize: '11px' },
              formatter: function () {
                const text = String(this.value || '');
                const max = 20;
                return text.length > max ? text.slice(0, max) + '…' : text;
              },
            },
          },
          yAxis: { min: 0, title: { text: '' } },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 5,
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                style: { color: TEXT_MUTED, fontSize: '10px', textOutline: 'none' },
              },
            },
          },
          series: [
            {
              name: 'Trámites',
              type: 'bar',
              data: values.map((v) => ({ y: v, color: COLOR_GREEN })), // ambiental → verde "neutro"
              showInLegend: false,
            },
            ...(typeof totalEnv === 'number'
              ? [{
                  name: `Total de trámites: (N=${totalEnv})`,
                  type: 'line',
                  data: [null],
                  enableMouseTracking: false,
                  showInLegend: true,
                  color: COLOR_GREEN,
                  marker: { enabled: false },
                }]
              : []),
          ],
        },
        { height: 520 }
      );
    }

    // 4) Entidad no ambiental
    const nonEnv = getIndicador('por_entidad_no_ambiental');
    let nonEnvOptionsLocal = null;
    if (nonEnv) {
      const totalNonEnv = nonEnv.totales?.tramites ?? null;
      const sorted      = [...nonEnv.data].sort((a, b) => a.tramites - b.tramites);
      const categories  = sorted.map((d) => d.entidad);
      const values      = sorted.map((d) => d.tramites);

      nonEnvOptionsLocal = withBaseChart(
        {
          chart: { type: 'bar', marginLeft: 260 },
          title: { text: nonEnv.metadata?.title || 'Trámites por entidad no ambiental' },
          subtitle: {
            text: sourceLabel,
            align: 'left',
            style: { color: '#B0B0B0', fontSize: '11px' },
            y: 30,
          },
          xAxis: {
            categories,
            title: { text: null },
            labels: {
              style: { color: '#D1D1D0', fontSize: '11px' },
              formatter: function () {
                const text = String(this.value || '');
                const max = 20;
                return text.length > max ? text.slice(0, max) + '…' : text;
              },
            },
          },
          yAxis: { min: 0, title: { text: '' } },
          legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 5,
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                style: { color: TEXT_MUTED, fontSize: '10px', textOutline: 'none' },
              },
            },
          },
          series: [
            {
              name: 'Trámites',
              type: 'bar',
              data: values.map((v) => ({ y: v, color: COLOR_LIME })), // no ambiental → lime
              showInLegend: false,
            },
            ...(typeof totalNonEnv === 'number'
              ? [{
                  name: `Total de trámites: (N=${totalNonEnv})`,
                  type: 'line',
                  data: [null],
                  enableMouseTracking: false,
                  showInLegend: true,
                  color: COLOR_LIME,
                  marker: { enabled: false },
                }]
              : []),
          ],
        },
        { height: 520 }
      );
    }

    return { techOptions: techOptionsLocal, capOptions: capOptionsLocal, envOptions: envOptionsLocal, nonEnvOptions: nonEnvOptionsLocal };
  }, [payload]);

  // Reflow al montar/actualizar
  useEffect(() => {
    if (!techOptions && !capOptions && !envOptions && !nonEnvOptions) return;
    setTimeout(() => {
      chartRefs.current.forEach((ref) => {
        if (ref && ref.chart) ref.chart.reflow();
      });
    }, 200);
  }, [techOptions, capOptions, envOptions, nonEnvOptions]);

  // Renders
  if (loading) {
    return (
      <section className="mt-8">
        <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[260px]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)' }} />
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.15s' }} />
            <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.3s' }} />
          </div>
          <p className="text-gray-300 mt-4">Cargando gestión de proyectos priorizados...</p>
        </div>
      </section>
    );
  }

  if (error) {
    const msg = typeof error === 'string' ? error : (error?.message || 'Error al cargar datos.');
    return (
      <section className="mt-8">
        <div className="bg-[#262626] p-6 rounded-lg border border-red-500 text-red-400">
          Error al cargar la gestión de proyectos priorizados: {msg}
        </div>
      </section>
    );
  }

  if (!techOptions && !capOptions) return null;

  return (
    <section className="mt-10 space-y-8">
      <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Gestión de proyectos priorizados 6GW+</h2>

      {/* Fila 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {techOptions && (
          <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow" style={{ minHeight: 360 }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={techOptions}
              ref={(el) => (chartRefs.current[0] = el)}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        )}
        {capOptions && (
          <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow" style={{ minHeight: 360 }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={capOptions}
              ref={(el) => (chartRefs.current[1] = el)}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        )}
      </div>

      {/* Fila 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {envOptions && (
          <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow" style={{ minHeight: 520 }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={envOptions}
              ref={(el) => (chartRefs.current[2] = el)}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        )}
        {nonEnvOptions && (
          <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow" style={{ minHeight: 520 }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={nonEnvOptions}
              ref={(el) => (chartRefs.current[3] = el)}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
