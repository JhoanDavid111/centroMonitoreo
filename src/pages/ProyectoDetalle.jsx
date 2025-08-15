// src/pages/ProyectoDetalle.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft, BadgeCheck, MapPin, CheckCircle2, Sun, Layers,
  Gauge, CalendarDays, FileText, CircleAlert
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import HighchartsReact from 'highcharts-react-official';
import proyectoDetalleImg from '../assets/proyectoDetalle.png';
// (opcional) import solarDarkmodeAmarillo from '../assets/solarDarkmodeAmarillo.svg';

// Highcharts modules
Exporting(Highcharts);
ExportData(Highcharts);
OfflineExporting(Highcharts);

// Tema oscuro global
Highcharts.setOptions({
  chart: { backgroundColor: '#262626', style: { fontFamily: 'Nunito Sans, sans-serif' } },
  title: { style: { color: '#fff', fontSize: '13px', fontWeight: 600 } },
  subtitle: { style: { color: '#aaa', fontSize: '11px' } },
  xAxis: { labels: { style: { color: '#ccc' } }, gridLineColor: '#333' },
  yAxis: { labels: { style: { color: '#ccc' } }, title: { style: { color: '#ccc' } }, gridLineColor: '#333' },
  legend: { itemStyle: { color: '#ccc' }, itemHoverStyle: { color: '#fff' }, itemHiddenStyle: { color: '#666' } },
  tooltip: { backgroundColor: '#1f2937', style: { color: '#fff' } }
});

const YELLOW = '#FFC800';
const LABEL = '#B0B0B0';
const BORDER = '#3a3a3a';

const IconPill = ({ children }) => (
  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-black" style={{ background: YELLOW }}>
    {children}
  </span>
);

const Chip = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-[#2b2b2b] border border-[#3a3a3a] text-gray-200 ${className}`}>
    {children}
  </span>
);

const StatCard = ({ icon, title, value }) => (
  <div className="bg-[#262626] border rounded-xl p-4" style={{ borderColor: BORDER }}>
    <div className="flex items-center gap-2 mb-1">
      <IconPill>{icon}</IconPill>
      <span className="text-sm" style={{ color: LABEL }}>{title}</span>
    </div>
    <div className="text-white text-xl font-semibold">{value}</div>
  </div>
);

const InfoTag = ({ icon, labelText, value }) => (
  <div className="bg-[#262626] border rounded-xl p-3" style={{ borderColor: BORDER }}>
    <div className="flex items-center gap-2 text-sm" style={{ color: LABEL }}>
      <IconPill>{icon}</IconPill>{labelText}
    </div>
    <div className="mt-2">
      <span className="inline-block rounded-md px-3 py-1 bg-[#1f1f1f] border" style={{ borderColor: BORDER }}>
        {value}
      </span>
    </div>
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="bg-[#262626] border rounded-xl p-4" style={{ borderColor: BORDER }}>
    <div className="text-sm mb-2" style={{ color: LABEL }}>Avances del proyectos</div>
    <div className="h-3 w-full bg-neutral-700 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500" style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }} />
    </div>
    <div className="text-right text-sm mt-1" style={{ color: LABEL }}>{value ?? 0}%</div>
  </div>
);

// util
const fmtFPO = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const mes = d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
  return `${String(d.getDate()).padStart(2, '0')}/${mes}/${d.getFullYear()}`;
};

export default function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); // { nombre } opcional desde la lista

  // Datos del proyecto (encabezado, stats, tags…)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [data, setData] = useState(null);

  // Curva S (desde API)
  const [curveLoading, setCurveLoading] = useState(true);
  const [curveError, setCurveError] = useState('');
  const [curveOptions, setCurveOptions] = useState(null);

  // Fetch info de proyecto
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const res = await fetch(
          `http://192.168.8.138:8002/v1/graficas/proyectos_075/informacion_proyecto/${id}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!Array.isArray(json) || json.length === 0) throw new Error('Sin datos del proyecto');
        if (alive) setData(json[0]);
      } catch (e) {
        if (alive) setErr(e.message || 'Error cargando el proyecto');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // Fetch Curva S — NUEVO ENDPOINT con referencia/seguimiento
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setCurveLoading(true);
        setCurveError('');

        const res = await fetch(
          `http://192.168.8.138:8002/v1/graficas/proyectos_075/grafica_curva_s/${id}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        const refArr = payload?.referencia?.curva ?? [];
        const segArr = payload?.seguimiento?.curva ?? [];

        if (!Array.isArray(refArr) && !Array.isArray(segArr)) {
          throw new Error('Sin datos de Curva S para este proyecto.');
        }

        // Normaliza
        const parse = (arr) =>
          (arr ?? [])
            .map(pt => ({
              iso: (pt.fecha || '').split('T')[0],          // YYYY-MM-DD
              avance: Number(pt.avance) || 0,
              hito_nombre: pt.hito_nombre ?? ''
            }))
            .filter(d => d.iso)
            .sort((a, b) => a.iso.localeCompare(b.iso));

        const refData = parse(refArr);
        const segData = parse(segArr);

        if (refData.length === 0 && segData.length === 0) {
          throw new Error('Sin datos de Curva S para este proyecto.');
        }

        // Unión de fechas ordenadas
        const catsRaw = Array.from(new Set([...refData, ...segData].map(d => d.iso))).sort();

        // Etiquetas dd/mes/aaaa
        const categories = catsRaw.map(iso => {
          const dt = new Date(iso);
          const m  = dt.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
          return `${String(dt.getDate()).padStart(2, '0')}/${m}/${dt.getFullYear()}`;
        });

        // Alinear datos a categorías
        const toSeriesData = (arr) =>
          catsRaw.map(iso => {
            const f = arr.find(d => d.iso === iso);
            return f ? { y: f.avance, hito_nombre: f.hito_nombre } : { y: null, hito_nombre: '' };
          });

        const options = {
          chart: { type: 'spline', height: 380, backgroundColor: '#262626' },
          title: { text: (state?.nombre || `Proyecto ${id}`).toString() },
          subtitle: { text: 'Curva S (programado vs cumplido)' },
          xAxis: {
            categories,
            tickInterval: 1,
            labels: { rotation: -45, step: 1, style: { color: '#ccc' } },
            gridLineColor: '#333'
          },
          yAxis: {
            title: { text: '' },
            min: 0, max: 100, tickInterval: 10,
            labels: { style: { color: '#ccc' } },
            gridLineColor: '#333'
          },
          tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: '#1f2937',
            style: { color: '#fff', fontSize: '12px' },
            formatter() {
              // toma el primer hito con texto disponible para esa fecha
              const firstHito =
                (this.points || []).map(p => p.point?.hito_nombre).find(Boolean) || '';
              const rows = (this.points || [])
                .map(p => `
                  <tr>
                    <td style="padding-right:8px;white-space:nowrap;">
                      <span style="color:${p.color}">●</span> ${Highcharts.escapeHTML(p.series.name)}:
                    </td>
                    <td style="text-align:right;"><b>${Highcharts.numberFormat(p.y ?? 0, 1)} %</b></td>
                  </tr>
                `)
                .join('');
              return `<b>${this.x}</b><br/>${firstHito ? `<div style="font-size:11px;color:#aaa;margin:4px 0">${Highcharts.escapeHTML(firstHito)}</div>` : ''}<table>${rows}</table>`;
            }
          },
          plotOptions: { series: { marker: { enabled: true, radius: 3 } } },
          series: [
            { name: 'Programado', data: toSeriesData(refData), color: '#60a5fa', lineWidth: 3 },
            { name: 'Cumplido',   data: toSeriesData(segData), color: '#b7fa5a', lineWidth: 3 }
          ],
          credits: { enabled: false },
          exporting: { enabled: true }
        };

        if (alive) setCurveOptions(options);
      } catch (e) {
        if (alive) setCurveError(e.message || 'Error cargando Curva S.');
      } finally {
        if (alive) setCurveLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [id, state?.nombre]);

  const title = useMemo(() => {
    const nombre = state?.nombre?.trim();
    if (nombre) return `${nombre} (ID ${id})`;
    if (data?.municipio || data?.tecnologia) {
      const tech = (data?.tecnologia ?? 'Proyecto').toString().toUpperCase();
      const loc = [data?.municipio, data?.departamento].filter(Boolean).join(', ');
      return `${tech}${loc ? ` – ${loc}` : ''} (ID ${id})`;
    }
    return `Proyecto (ID ${id})`;
  }, [state?.nombre, data, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC800] mb-4" />
          <p>Cargando proyecto…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4">
        <p className="text-red-400 mb-4">Error: {err}</p>
        <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-md text-black" style={{ background: YELLOW }}>
          <ChevronLeft size={18} /> Volver
        </button>
      </div>
    );
  }

  const fpo = fmtFPO(data?.fpo);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header local */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22px] font-semibold">{title}</h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-black hover:brightness-95"
            style={{ background: YELLOW }}
          >
            <ChevronLeft size={18} /> Volver
          </button>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data?.promotor && <Chip><BadgeCheck size={14} /> Promotor: {data.promotor}</Chip>}
          {(data?.municipio || data?.departamento) && (
            <Chip><MapPin size={14} /> Ubicación: {[data.municipio, data.departamento].filter(Boolean).join(', ')}</Chip>
          )}
          {data?.estado_proyecto && <Chip><CheckCircle2 size={14} /> Estado: {data.estado_proyecto}</Chip>}
        </div>
      </div>

      {/* Resumen */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-[18px] font-semibold mb-2" style={{ color: '#D1D1D0' }}>Resumen</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Imagen resumen */}
          <div className="lg:col-span-2 bg-[#262626] border rounded-xl p-3" style={{ borderColor: BORDER }}>
            <div className="rounded-lg overflow-hidden">
              <img
                src={proyectoDetalleImg}
                alt="Proyecto"
                className="w-full h-56 md:h-72 object-cover"
              />
            </div>
            <div className="mt-3">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-black font-medium hover:brightness-95" style={{ background: YELLOW }}>
                <FileText size={16} /> Documentos del proyectos
              </button>
            </div>
          </div>

          {/* 4 stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={<Sun size={16} />} title="Tecnología" value={data?.tecnologia ?? '-'} />
            <StatCard icon={<Layers size={16} />} title="Ciclo de asignación" value={data?.ciclo_asignacion ?? '-'} />
            <StatCard icon={<Gauge size={16} />} title="Capacidad asignada" value={`${data?.capacidad_instalada_mw ?? 0} MW`} />
            <StatCard icon={<CalendarDays size={16} />} title="FPO vigente" value={fpo} />
          </div>
        </div>

        {/* Avance */}
        <div className="mt-4">
          <ProgressBar value={data?.porcentaje_avance} />
        </div>

        {/* Curva S */}
        <div className="text-[18px] font-semibold mt-6 mb-2" style={{ color: '#D1D1D0' }}>
          Seguimiento Curva S
        </div>
        <div className="bg-[#262626] border rounded-xl p-3" style={{ borderColor: BORDER }}>
          {curveLoading && <p className="text-gray-300 px-2 py-4">Cargando Curva S…</p>}
          {!curveLoading && curveError && <p className="text-red-400 px-2 py-4">Error: {curveError}</p>}
          {!curveLoading && !curveError && curveOptions && (
            <HighchartsReact highcharts={Highcharts} options={curveOptions} />
          )}
          {!curveLoading && !curveError && !curveOptions && (
            <p className="text-gray-300 px-2 py-4">Sin datos para graficar.</p>
          )}
          <div className="px-3 pb-3 -mt-2">
            <div className="flex items-center justify-center gap-4">
              <span className="inline-flex items-center gap-2 text-sm bg-[#2b2b2b] px-3 py-1 rounded border" style={{ borderColor: BORDER }}>
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#60a5fa' }} /> Programado
              </span>
              <span className="inline-flex items-center gap-2 text-sm bg-[#2b2b2b] px-3 py-1 rounded border" style={{ borderColor: BORDER }}>
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#b7fa5a' }} /> Cumplido
              </span>
            </div>
          </div>
        </div>

        {/* Ubicación y detalles */}
        <div className="text-[18px] font-semibold mt-6 mb-2" style={{ color: '#D1D1D0' }}>Ubicación y detalles</div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <InfoTag icon={<CircleAlert size={16} />} labelText="Departamento" value={data?.departamento ?? '-'} />
          <InfoTag icon={<MapPin size={16} />} labelText="Municipio" value={data?.municipio ?? '-'} />
          <InfoTag icon={<BadgeCheck size={16} />} labelText="Área operativa" value={data?.area_operativa ?? '-'} />
          <InfoTag icon={<BadgeCheck size={16} />} labelText="Subárea" value={data?.subarea ?? '-'} />
          <InfoTag icon={<BadgeCheck size={16} />} labelText="Punto de conexión" value={data?.punto_conexion_seleccionado ?? '-'} />
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}



