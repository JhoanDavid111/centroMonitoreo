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
import EnergiaElectricaOn from '../assets/svg-icons/EnergiaElectrica-On.svg';
import TerritorioOn from '../assets/svg-icons/Territorio-On.svg';
import LocationOn from '../assets/svg-icons/location-On.svg';
import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg';
import CalendarDarkmodeAmarillo from '../assets/svg-icons/calendarDarkmodeAmarillo.svg';
import { useInformacionProyecto, useCurvaS } from '../services/graficasService';

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
      {/* Ícono sin pill/fondo */}
      <span className="inline-flex items-center justify-center w-5 h-5">
        {icon}
      </span>
      <span className="text-sm" style={{ color: LABEL }}>{title}</span>
    </div>
    <div className="text-white text-xl font-semibold">{value}</div>
  </div>
);

const InfoTag = ({ icon, labelText, value }) => (
  <div className="bg-[#262626] border rounded-xl p-3" style={{ borderColor: BORDER }}>
    <div className="flex items-center gap-2 text-sm" style={{ color: LABEL }}>
      <span className="inline-flex items-center justify-center w-5 h-5">
        {icon}
      </span>
      {labelText}
    </div>
    <div className="mt-2 text-white font-semibold leading-snug whitespace-normal break-words">
      {value ?? '-'}
    </div>
  </div>
);

// Reemplaza la definición anterior de ProgressBar por esta:
const ProgressBar = ({ value }) => {
  const v = Math.max(0, Math.min(100, Number(value || 0)));

  // Colores por tramo
  // 0 - 25%   => rojo    #EF4444
  // 25 - 50%  => naranja #F97316
  // 50 - 75%  => amarillo#FFC800
  // 75 - 100% => verde   #22C55E
  const getColor = (pct) => {
    if (pct <= 25) return '#EF4444';
    if (pct <= 50) return '#F97316';
    if (pct <= 75) return '#FFC800';
    return '#22C55E';
  };

  const barColor = getColor(v);

  return (
    <div className="bg-[#262626] border rounded-xl p-4" style={{ borderColor: BORDER }}>
      <div className="text-sm mb-2" style={{ color: LABEL }}>Avances del proyectos</div>

      <div
        className="h-3 w-full rounded-full overflow-hidden"
        style={{ background: '#3b3b3b' }}
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
        title={`${v}%`}
      >
        <div
          className="h-full"
          style={{
            width: `${v}%`,
            background: barColor,
            transition: 'width 400ms ease',
          }}
        />
      </div>

      <div className="text-right text-sm mt-1" style={{ color: LABEL }}>{v}%</div>
    </div>
  );
};

// util
const fmtFPO = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const mes = d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
  return `${String(d.getDate()).padStart(2, '0')}/${mes}/${d.getFullYear()}`;
};

// ===== Opciones BASE de Curva S (igual que ProjectGrid) =====
// ===== Opciones BASE de Curva S (placeholders en leyenda, fechas en nombre) =====
const baseCurveOptions = {
  chart: {
    type: 'spline',
    height: 520,
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
    useHTML: true,
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' },
    // si la "serie" es un placeholder (mensaje), pintamos el texto en rojo
    labelFormatter: function () {
      if (this.userOptions && this.userOptions.isPlaceholder) {
        return `<span style="color:#ef4444">${this.name}</span>`;
      }
      return this.name;
    }
  },

  credits: { enabled: false },

  tooltip: {
    shared: false,
    useHTML: false,
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

  // Se arma dinámicamente al cargar la curva
  series: [],

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
  const [data, setData] = useState(null);
  
  // Curva S
  const [curveOptions, setCurveOptions] = useState(baseCurveOptions);

  // Fetch info de proyecto
  const { data: proyectoData, isLoading: loading, error: err } = useInformacionProyecto(id);
  
  useEffect(() => {
    if (proyectoData && Array.isArray(proyectoData) && proyectoData.length > 0) {
      setData(proyectoData[0]);
    }
  }, [proyectoData]);

// Fetch Curva S — construye series (referencia/seguimiento) o mensajes en leyenda
  const { data: curvaData, isLoading: curveLoading, error: curveError } = useCurvaS(id);

  useEffect(() => {
    if (!curvaData) return;

    const formatDMY = (iso) => {
      if (!iso) return '';
      const [y, m, d] = String(iso).split('-');
      return (y && m && d) ? `${d}/${m}/${y}` : iso;
    };

    const parse = (arr) =>
      (arr ?? [])
        .map(pt => {
          if (!pt || typeof pt === 'string') return null;
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

    try {
      setCurveLoading(false);
      setCurveError('');

      const payload = curvaData;

      const refRaw = payload?.referencia?.curva;
      const segRaw = payload?.seguimiento?.curva;
      const refRad = payload?.referencia?.fecha_radicado || null;
      const segRad = payload?.seguimiento?.fecha_radicado || null;

      const refIsMsg = Array.isArray(refRaw) && refRaw.length > 0 && typeof refRaw[0] === 'string';
      const segIsMsg = Array.isArray(segRaw) && segRaw.length > 0 && typeof segRaw[0] === 'string';

      const refData = refIsMsg ? [] : parse(refRaw);
      const segData = segIsMsg ? [] : parse(segRaw);

      const refName = `Curva de referencia${refRad ? ` (${formatDMY(refRad)})` : ''}`;
      const segName = `Curva de seguimiento${segRad ? ` (${formatDMY(segRad)})` : ''}`;

      const series = [];

      const COLOR_REF = '#60A5FA';  // azul referencia
      const COLOR_SEG = '#A3E635';  // verde seguimiento

    // Referencia
    if (refIsMsg) {
      series.push({
        type: 'spline',
        name: String(refRaw[0]),   // mensaje del servicio
        data: [],
        color: COLOR_REF,          // << azul aunque no haya datos
        showInLegend: true,
        enableMouseTracking: false,
        isPlaceholder: true,
        marker: { enabled: true, symbol: 'circle' }
      });
    } else if (refData.length) {
      series.push({
        type: 'spline',
        name: refName,
        data: refData,
        color: COLOR_REF
      });
    }

    // Seguimiento
    if (segIsMsg) {
      series.push({
        type: 'spline',
        name: String(segRaw[0]),   // mensaje del servicio
        data: [],
        color: COLOR_SEG,          // << VERDE aunque no haya datos
        showInLegend: true,
        enableMouseTracking: false,
        isPlaceholder: true,
        marker: { enabled: true, symbol: 'circle' }
      });
    } else if (segData.length) {
      series.push({
        type: 'spline',
        name: segName,
        data: segData,
        color: COLOR_SEG
      });
    }


      if (series.length === 0) {
        setCurveError('Sin datos de Curva S para este proyecto.');
        setCurveOptions(o => ({ ...o, series: [] }));
        return;
      }

      setCurveOptions(o => ({
        ...o,
        title: { ...o.title, text: (data?.nombre || `Proyecto ${id}`).toString() },
        legend: { ...o.legend, useHTML: true }, // asegura el rojo en placeholders
        series
      }));
    } catch (e) {
      console.error('Error procesando curva S:', e);
    } finally {
      if (chartContainerRef.current) {
        const OFFSET = 80;
        const top = chartContainerRef.current.getBoundingClientRect().top + window.scrollY - OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(() => chartRef.current?.chart?.reflow(), 250);
      }
    }
  }, [curvaData, id, data]);


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
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 pt-4">
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
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
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
          <StatCard
            icon={<img src={AutogeneracionOn} alt="Autogeneración" className="w-4 h-4" draggable="false" />}
            title="Tecnología"
            value={data?.tecnologia ?? '-'}
          />
          <StatCard
            icon={<img src={EnergiaElectricaOn} alt="Ciclo" className="w-4 h-4" draggable="false" />}
            title="Ciclo de asignación"
            value={data?.ciclo_asignacion ?? '-'}
          />
          <StatCard
            icon={<img src={EnergiaElectricaOn} alt="Capacidad" className="w-4 h-4" draggable="false" />}
            title="Capacidad asignada"
            value={`${data?.capacidad_instalada_mw ?? 0} MW`}
          />
          <StatCard
            icon={<img src={CalendarDarkmodeAmarillo} alt="Calendario" className="w-4 h-4" draggable="false" />}
            title="FPO vigente"
            value={fpo}
          />
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
  <InfoTag
    icon={<img src={TerritorioOn} alt="Territorio" className="w-4 h-4" draggable="false" />}
    labelText="Departamento"
    value={data?.departamento ?? '-'}
  />
  <InfoTag
    icon={<img src={TerritorioOn} alt="Territorio" className="w-4 h-4" draggable="false" />}
    labelText="Municipio"
    value={data?.municipio ?? '-'}
  />
  <InfoTag
    icon={<img src={LocationOn} alt="Ubicación" className="w-4 h-4" draggable="false" />}
    labelText="Área operativa"
    value={data?.area_operativa ?? '-'}
  />
  <InfoTag
    icon={<img src={LocationOn} alt="Ubicación" className="w-4 h-4" draggable="false" />}
    labelText="Subárea"
    value={data?.subarea ?? '-'}
  />
  <InfoTag
    icon={<img src={EnergiaElectricaOn} alt="Energía eléctrica" className="w-4 h-4" draggable="false" />}
    labelText="Punto de conexión"
    value={data?.punto_conexion_seleccionado ?? '-'}
  />
</div>

        <div className="h-8" />
      </div>
    </div>
  );
}






