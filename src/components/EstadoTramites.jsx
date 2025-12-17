// src/components/EstadoTramites.jsx
import { useMemo, useRef } from 'react';
import Highcharts from '../lib/highcharts-config';
import HighchartsReact from 'highcharts-react-official';
import { useEstadoTramites } from '../services/indicadoresAmbientalesService';

const COLORS = {
  bgCard: '#262626',
  borderCard: '#3A3A3A',
  title: '#FFFFFF',
  subtitle: '#9CA3AF',
  axis: '#9CA3AF',
  grid: '#444444',
  tooltipBg: '#111827',
  tooltipBorder: '#4B5563',
  barGold: '#C8A12D',
  barGray: '#D1D5DB',
  solar: '#FFC800',
  hidrica: '#3B82F6',
  eolica: '#5DFF97',
  transmision: '#F950B5',
};

export default function EstadoTramites() {
  const chartRefs = useRef([]);
  const { data, isLoading, error } = useEstadoTramites(); // <- isLoading

  const { opcionesSegunRespuesta, opcionesPorTipoProyecto } = useMemo(() => {
    if (!data?.indicadores) return { opcionesSegunRespuesta: null, opcionesPorTipoProyecto: null };

    const meta = data.metadata || {};
    const sourceLabel = meta.source || 'Minenergía – OAAS';
    const lastUpdate = meta.last_update ? new Date(meta.last_update).toLocaleDateString('es-CO') : '';

    // 1) Según respuestas de las entidades
    const sr = data.indicadores.segun_respuesta_entidades || {};
    const totalTramitesSR = sr.total_tramites || 0;
    const respuestasOrdenadas = [
      { key: 'Finalizado', label: 'Finalizado' },
      { key: 'Entidad', label: 'En trámite entidad' },
      { key: 'Sin Respuesta', label: 'Sin respuesta' },
      { key: 'Empresa', label: 'En la empresa' },
      { key: 'Solicitud Inadecuada', label: 'Solicitud inadecuada' },
      { key: 'Archivado', label: 'Archivado' },
      { key: 'Suspendido', label: 'Suspendido' },
    ];
    const valoresSR = respuestasOrdenadas.map(({ key }) => {
      const row = (sr.data || []).find((d) => d.respuesta === key);
      return row ? Number(row.total || 0) : 0;
    });
    const maxSR = Math.max(...valoresSR, 0);

    const opcionesSegunRespuesta = {
      chart: { type: 'column', backgroundColor: COLORS.bgCard, height: 420, spacing: [20, 16, 24, 16] },
      title: {
        text: `${sr.titulo || 'Según respuestas de las entidades'} (N=${totalTramitesSR || ''})`,
        align: 'left',
        style: { color: COLORS.title, fontSize: '20px', fontWeight: 600, fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont' },
      },
      subtitle: {
        text: `Fuente: ${sourceLabel}` + (lastUpdate ? ` / Actualizado el: ${lastUpdate}` : ''),
        align: 'left',
        style: { color: COLORS.subtitle, fontSize: '12px', fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont' },
        margin: 16,
      },
      xAxis: {
        categories: respuestasOrdenadas.map((r) => r.label),
        lineColor: COLORS.grid,
        tickColor: COLORS.grid,
        labels: { style: { color: COLORS.axis, fontSize: '11px' } },
      },
      yAxis: {
        min: 0,
        max: maxSR + 10,
        title: { text: null },
        gridLineColor: '#3F3F46',
        labels: { style: { color: COLORS.axis, fontSize: '11px' } },
      },
      legend: { enabled: false },
      tooltip: {
        useHTML: true,
        backgroundColor: COLORS.tooltipBg,
        borderColor: COLORS.tooltipBorder,
        style: { color: '#F9FAFB', fontSize: '12px', fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont' },
        formatter: function () {
          return `
            <div style="padding:8px 10px;">
              <div style="font-weight:600;margin-bottom:4px;">${this.key}</div>
              <div>Total: <b>${this.y}</b></div>
            </div>
          `;
        },
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          pointPadding: 0.15,
          groupPadding: 0.1,
          dataLabels: {
            enabled: true,
            style: { color: '#F9FAFB', textOutline: 'none', fontSize: '11px', fontWeight: 600 },
          },
        },
      },
      series: [
        {
          name: 'Trámites',
          colorByPoint: true,
          data: valoresSR.map((y, idx) => ({ y, color: idx === 0 ? '#FFC8008A' : '#E2E8F099' })),
        },
      ],
      credits: { enabled: false },
      exporting: { enabled: true },
    };

    // 2) Por tipo de proyecto (apiladas)
    const ptp = data.indicadores.por_tipo_proyecto || {};
    const totales = ptp.totales || {};
    const rows = ptp.data || [];

    const estadosOrden = respuestasOrdenadas;
    const tecnologias = ['Solar', 'Hídrica', 'Eólica', 'Transmisión'];
    const colorTec = { Solar: COLORS.solar, Hídrica: COLORS.hidrica, Eólica: COLORS.eolica, Transmisión: COLORS.transmision };
    const categoriasPTP = estadosOrden.map((e) => e.label);

    const seriesPTP = tecnologias.map((tec) => ({
      name: `${tec} (N=${totales[tec] ?? 0})`,
      color: colorTec[tec],
      data: estadosOrden.map(({ key }) => {
        const row = rows.find((r) => r.estado_respuesta === key);
        return row ? Number(row[tec] || 0) : 0;
      }),
    }));

    const opcionesPorTipoProyecto = {
      chart: { type: 'column', backgroundColor: COLORS.bgCard, height: 420, spacing: [20, 16, 24, 16] },
      title: {
        text: ptp.titulo || 'Por tipo de proyecto',
        align: 'left',
        style: { color: COLORS.title, fontSize: '20px', fontWeight: 600, fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont' },
      },
      subtitle: {
        text: `Fuente: ${sourceLabel}` + (lastUpdate ? ` / Actualizado el: ${lastUpdate}` : ''),
        align: 'left',
        style: { color: COLORS.subtitle, fontSize: '12px', fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont' },
        margin: 16,
      },
      xAxis: {
        categories: categoriasPTP,
        lineColor: COLORS.grid,
        tickColor: COLORS.grid,
        labels: { style: { color: COLORS.axis, fontSize: '11px' } },
      },
      yAxis: {
        min: 0,
        title: { text: 'Número de proyectos y trámites', style: { color: COLORS.axis, fontSize: '12px' } },
        gridLineColor: '#3F3F46',
        labels: { style: { color: COLORS.axis, fontSize: '11px' } },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: { color: COLORS.title, fontSize: '12px', fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont' },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: COLORS.tooltipBg,
        borderColor: COLORS.tooltipBorder,
        style: { color: '#F9FAFB', fontSize: '12px', fontFamily: 'Nunito Sans, system-ui, -apple-system, BlinkMacSystemFont' },
        formatter: function () {
          const total = (this.points || []).reduce((acc, p) => acc + (p.y || 0), 0);
          const filas = (this.points || [])
            .filter((p) => p.y > 0)
            .map(
              (p) => `
                <div style="display:flex;align-items:center;gap:6px;margin:2px 0;">
                  <span style="color:${p.color};">●</span>
                  <span>${p.series.name.split(' (')[0]}: <b>${p.y}</b></span>
                </div>`
            )
            .join('');
          return `
            <div style="padding:10px 12px;">
              <div style="font-weight:600;margin-bottom:6px;">${this.x}</div>
              ${filas || '<div>Sin datos</div>'}
              <hr style="border-color:#374151;margin:6px 0;" />
              <div>Total: <b>${total}</b></div>
            </div>
          `;
        },
      },
      plotOptions: { column: { stacking: 'normal', borderWidth: 0, pointPadding: 0.1, groupPadding: 0.08, dataLabels: { enabled: false } } },
      series: seriesPTP,
      credits: { enabled: false },
      exporting: { enabled: true },
    };

    return { opcionesSegunRespuesta, opcionesPorTipoProyecto };
  }, [data]);

  // ⬇️ Aquí estaba el error: usar isLoading
  if (isLoading) {
    return (
      <section className="mt-10 px-2">
        <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Estado de los trámites</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="bg-[#262626] border border-[#3A3A3A] rounded-xl p-4 h-[420px] flex items-center justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce" />
                <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce delay-150" />
                <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce delay-300" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !opcionesSegunRespuesta || !opcionesPorTipoProyecto) {
    return (
      <section className="mt-10 px-2">
        <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Estado de los trámites</h2>
        <div className="bg-[#262626] border border-red-500 text-red-400 rounded-xl p-4">
          Error al cargar las gráficas: {String(error) || 'Datos no disponibles'}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 px-2">
      <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Estado de los trámites</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#262626] border border-[#3A3A3A] rounded-xl p-4 shadow">
          <HighchartsReact highcharts={Highcharts} options={opcionesSegunRespuesta} />
        </div>
        <div className="bg-[#262626] border border-[#3A3A3A] rounded-xl p-4 shadow">
          <HighchartsReact highcharts={Highcharts} options={opcionesPorTipoProyecto} />
        </div>
      </div>
    </section>
  );
}
