// src/pages/ProyectoDetalle.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft, BadgeCheck, MapPin, CheckCircle2, Sun, Layers,
  Gauge, CalendarDays, CircleAlert
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import HighchartsReact from 'highcharts-react-official';
import proyectoDetalleImg from '../assets/proyectoDetalle.png';

// ===== Inicialización Highcharts =====
Exporting(Highcharts);
ExportData(Highcharts);
OfflineExporting(Highcharts);

Highcharts.setOptions({
  chart: { backgroundColor: '#262626', style: { fontFamily: 'Nunito Sans, sans-serif' } },
  title: { style: { color: '#fff', fontSize: '16px', fontWeight: 600 } },
  subtitle: { style: { color: '#aaa', fontSize: '12px' } },
  xAxis: { labels: { style: { color: '#ccc', fontSize: '10px' } }, gridLineColor: '#333' },
  yAxis: { labels: { style: { color: '#ccc', fontSize: '10px' } }, title: { style: { color: '#ccc' } }, gridLineColor: '#333' },
  legend: { itemStyle: { color: '#ccc' }, itemHoverStyle: { color: '#fff' }, itemHiddenStyle: { color: '#666' } },
  tooltip: { backgroundColor: '#1f2937', style: { color: '#fff', fontSize: '12px' } }
});

// ===== Estilos locales =====
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

// ===== Opciones BASE de Curva S (igual que ProjectGrid) =====
const baseCurveOptions = {
  chart: {
    type: 'spline',
    height: 520,                 // más alto
    backgroundColor: '#262626',
    animation: false
  },
  title: { text: 'Curva S – Proyecto', style: { color: '#fff' } },
  subtitle: { text: '' },
  xAxis: {
    type: 'datetime',
    gridLineColor: '#333',
    tickPixelInterval: 80,
    dateTimeLabelFormats: {
      day:   '%e %b %Y',
      week:  '%e %b %Y',
      month: '%b %Y',
      year:  '%Y'
    },
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    crosshair: { width: 1 }
  },
  yAxis: {
    title: { text: 'Avance (%)', style: { color: '#ccc' } },
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    gridLineColor: '#333',
    min: 0,
    max: 100,
    crosshair: { width: 1 }
  },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  credits: { enabled: false },
  tooltip: {
    shared: false,         // por punto (como en ProjectGrid)
    useHTML: false,        // etiqueta SVG rápida
    followPointer: false,
    stickOnContact: true,
    hideDelay: 60,
    snap: 16,
    xDateFormat: '%Y-%m-%d',
    formatter: function () {
      const fecha = Highcharts.dateFormat('%Y-%m-%d', this.x);
      const valor = Highcharts.numberFormat(this.y ?? 0, 1);
      const hito  = this.point?.hito_nombre ? `\n${this.point.hito_nombre}` : '';
      return `${fecha}\n${this.series.name}: ${valor} %${hito}`;
    }
  },
  plotOptions: {
    series: {
      turboThreshold: 0,
      stickyTracking: false,
      animation: { duration: 150 },
      states: { hover: { halo: { size: 7 } } },
      boostThreshold: 2000
    },
    spline: {
      marker: { enabled: true, radius: 4, lineWidth: 1 },
      connectNulls: false
    }
  },
  series: [
    { name: 'Programado', data: [], color: '#60A5FA' },
    { name: 'Cumplido',   data: [], color: '#A3E635' }
  ],
  exporting: {
    enabled: true,
    buttons: {
      contextButton: { menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG'] },
    }
  },
  responsive: {
    rules: [{ condition: { maxWidth: 640 }, chartOptions: { chart: { height: 420 } } }]
  }
};

export default function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); // { nombre } opcional

  // Refs para scroll y reflow
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);

  // Datos del proyecto (encabezado)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [data, setData] = useState(null);

  // Curva S
  const [curveLoading, setCurveLoading] = useState(true);
  const [curveError, setCurveError] = useState('');
  const [curveOptions, setCurveOptions] = useState(baseCurveOptions);

  // Fetch info de proyecto
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const res = await fetch(
          `${API}/v1/graficas/proyectos_075/informacion_proyecto/${encodeURIComponent(id)}`,
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

  // Fetch Curva S — datetime puro (evita duplicados de categorías)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setCurveLoading(true);
        setCurveError('');

        const res = await fetch(
          `${API}/v1/graficas/proyectos_075/grafica_curva_s/${encodeURIComponent(id)}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        const refArr = payload?.referencia?.curva ?? [];
        const segArr = payload?.seguimiento?.curva ?? [];

        // Parse a puntos datetime {x: timestamp, y, hito_nombre}
        const parse = (arr) =>
          (arr ?? [])
            .map(pt => {
              const iso = (pt.fecha || '').split('T')[0];
              if (!iso) return null;
              const t = new Date(iso).getTime();
              const y = Number(pt.avance);
              return Number.isFinite(t) && Number.isFinite(y)
                ? { x: t, y, hito_nombre: pt.hito_nombre ?? '' }
                : null;
            })
            .filter(Boolean)
            .sort((a, b) => a.x - b.x);

        const refData = parse(refArr);
        const segData = parse(segArr);

        if (refData.length === 0 && segData.length === 0) {
          throw new Error('Sin datos de Curva S para este proyecto.');
        }

        // Actualiza opciones conservando estilos base
        if (alive) {
          setCurveOptions(opts => ({
            ...opts,
            title: { ...opts.title, text: (state?.nombre || `Proyecto ${id}`).toString() },
            series: [
              { ...opts.series[0], name: 'Programado', data: refData, color: '#60A5FA' },
              { ...opts.series[1], name: 'Cumplido',   data: segData, color: '#A3E635' },
            ]
          }));
        }
      } catch (e) {
        if (alive) setCurveError(e.message || 'Error cargando Curva S.');
      } finally {
        if (alive) {
          setCurveLoading(false);

          // Scroll automático a la gráfica + reflow (como en ProjectGrid)
          if (chartContainerRef.current) {
            const OFFSET = 80; // ajusta según tu header fijo
            const top = chartContainerRef.current.getBoundingClientRect().top + window.scrollY - OFFSET;
            window.scrollTo({ top, behavior: 'smooth' });
            setTimeout(() => {
              chartRef.current?.chart?.reflow();
            }, 250);
          }
        }
      }
    })();

    return () => { alive = false; };
  }, [id, state?.nombre]);

  // Reflow en resize
  useEffect(() => {
    const onResize = () => chartRef.current?.chart?.reflow();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
        <div
          ref={chartContainerRef}
          className="bg-[#262626] border rounded-xl p-3 scroll-mt-24"
          style={{ borderColor: BORDER }}
        >
          {curveLoading && <p className="text-gray-300 px-2 py-4">Cargando Curva S…</p>}
          {!curveLoading && curveError && <p className="text-red-400 px-2 py-4">Error: {curveError}</p>}
          {!curveLoading && !curveError && (
            <HighchartsReact highcharts={Highcharts} options={curveOptions} ref={chartRef} />
          )}
          {/* NOTA: Se eliminó la leyenda manual para evitar duplicados */}
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






