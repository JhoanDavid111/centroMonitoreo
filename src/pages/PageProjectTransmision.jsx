// src/pages/TransmisionDetalle.jsx
import React, { useState } from 'react';
import {
  ChevronLeft, CalendarDays, CalendarClock, CalendarRange, FileText,
  AlertTriangle, Gauge, Zap, Cable, MapPin, Circle, Sun, Wind, Factory, Clock, ChevronRight, ChevronLeft as ArrowLeft
} from 'lucide-react';

/* ===== Design tokens ===== */
const COLORS = {
  pageBg: '#1a1a1a',
  cardBg: '#262626',
  border: '#3a3a3a',
  heading: '#D1D1D0',
  label: '#B0B0B0',
  white: '#ffffff',
  yellow: '#FFC800',
  green: '#22c55e',
  warn: '#ef4444'
};

/* ===== Helpers ===== */
const fmtDate = (iso) => {
  // 2025-12-26 -> 26/dic/2025
  const d = new Date(iso);
  const m = d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
  return `${String(d.getDate()).padStart(2, '0')}/${m}/${d.getFullYear()}`;
};

const Bar = ({ value = 0, color = 'bg-emerald-500', track = 'bg-neutral-700' }) => (
  <div className={`h-3 w-full ${track} rounded-full overflow-hidden`}>
    <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

/* ===== UI atoms ===== */
const Chip = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-[#2b2b2b] border border-[#3a3a3a] text-gray-200 ${className}`}>
    {children}
  </span>
);

const IconPill = ({ children }) => (
  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full" style={{ background: COLORS.yellow }}>
    <span className="text-black">{children}</span>
  </span>
);

const DotLabel = ({ text }) => (
  <div className="flex items-center gap-2 text-white">
    <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
    <span>{text}</span>
  </div>
);

/* ===== Cards ===== */
const StatCard = ({ icon, title, value, hint }) => (
  <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
    <div className="flex items-center gap-2 mb-1">
      <IconPill>{icon}</IconPill>
      <span className="text-sm" style={{ color: COLORS.label }}>{title}</span>
    </div>
    <div className="text-2xl font-semibold" style={{ color: COLORS.white }}>
      {value}
    </div>
    {hint && <div className="text-xs mt-1" style={{ color: COLORS.label }}>{hint}</div>}
  </div>
);

const SmallMetricCard = ({ icon, title, value, updated }) => (
  <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
    <div className="flex items-center gap-2 mb-1">
      <IconPill>{icon}</IconPill>
      <span className="text-sm" style={{ color: COLORS.label }}>{title}</span>
    </div>
    <div className="text-2xl font-semibold text-white mb-1">{value}</div>
    <div className="flex items-center gap-1 text-xs" style={{ color: COLORS.label }}>
      <Clock size={12} /> Actualizado el: {updated}
    </div>
  </div>
);

const ProgressCard = ({ title, bars = [] }) => (
  <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
    <h4 className="text-white font-semibold mb-2">{title}</h4>
    {bars.map((b, i) => (
      <div key={i} className="mb-3">
        <div className="flex items-center justify-between text-sm" style={{ color: COLORS.label }}>
          <span>{b.label}</span><span>{b.value}%</span>
        </div>
        <Bar value={b.value} color={b.color} />
      </div>
    ))}
  </div>
);

/* ===== Mock data (reemplaza con API luego) ===== */
const proyecto = {
  nombre: 'UPME 01 – 2013 Sogamoso - Norte - Nueva Esperanza 500 kV',
  badges: [
    'Inversionista: GEB Grupo Energía Bogotá',
    'Ubicación: Santander, Boyacá y Cundinamarca',
    'Etapa: Ejecución de obras'
  ],
  estado: 'Estado: Desfase crítico',
  fpo: {
    vigente: '2025-12-26',
    inicial: '2017-09-30',
    estimadaInter: '2027-08-18',
    cambios: 12
  },
  avances: {
    subestaciones: 56,
    lineas: 35,
    desfaseDias: 950,
    updated: '05/2025'
  },
  tramos: [
    {
      titulo: 'Tramo Sogamoso - Norte',
      barras: [
        { label: 'Licencia ambiental', value: 100, color: 'bg-emerald-500' },
        { label: 'Avance en la construcción', value: 50, color: 'bg-yellow-400' }
      ]
    },
    {
      titulo: 'Tramo Norte - Nueva Esperanza',
      barras: [
        { label: 'Licencia ambiental', value: 100, color: 'bg-emerald-500' },
        { label: 'Avance en la construcción', value: 0, color: 'bg-yellow-400' }
      ]
    }
  ],
  subestaciones: [
    {
      titulo: 'Subestación Sogamoso',
      barras: [
        { label: 'Licencia ambiental', value: 100, color: 'bg-emerald-500' },
        { label: 'Avance en la construcción', value: 50, color: 'bg-yellow-400' }
      ]
    },
    {
      titulo: 'Subestación Norte',
      barras: [
        { label: 'Licencia ambiental', value: 100, color: 'bg-emerald-500' },
        { label: 'Avance en la construcción', value: 0, color: 'bg-yellow-400' }
      ]
    },
    {
      titulo: 'Subestación Nueva Esperanza',
      barras: [
        { label: 'Licencia ambiental', value: 100, color: 'bg-emerald-500' },
        { label: 'Avance en la construcción', value: 0, color: 'bg-yellow-400' }
      ]
    }
  ],
  generacion: {
    totalProyectos: 19,
    totalMW: 1546,
    solares: 15,
    eolicos: 4
  }
};

const carouselImgs = [
  '../src/assets/images/Slider_transmision1.png',
  '../src/assets/images/Slider_transmision2.png',
  '../src/assets/images/Slider_transmision3.png',
  
];

/* ===== Page ===== */
export default function TransmisionDetalle() {
  const [slide, setSlide] = useState(0);
  const prev = () => setSlide((s) => (s - 1 + carouselImgs.length) % carouselImgs.length);
  const next = () => setSlide((s) => (s + 1) % carouselImgs.length);

  return (
    <div className="min-h-screen" style={{ background: COLORS.pageBg, color: COLORS.white }}>
      {/* Header local de la página (tu app ya tiene nav superior) */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold">{proyecto.nombre}</h1>
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: '#2d2d2d', border: `1px solid ${COLORS.border}` }}
          >
            <ChevronLeft size={18}/> Volver
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {proyecto.badges.map((b, i) => <Chip key={i}>{b}</Chip>)}
          <Chip className="bg-red-600/90 text-white border-red-700"><AlertTriangle size={14}/> {proyecto.estado}</Chip>
        </div>
      </div>

      {/* ===== Fechas de puesta en operación ===== */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.heading }}>Fechas de puesta en operación</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Imagen + botón */}
          <div className="lg:col-span-2 bg-[#262626] border border-[#3a3a3a] rounded-xl p-3">
            <div className="overflow-hidden rounded-lg">
              <img
              
                src="../src/assets/images/subestacion.jpg"
                alt="Subestación_"
                className="w-full h-56 md:h-72 object-cover"
              />
            </div>
            <div className="mt-3">
              <button className="inline-flex items-center gap-2 font-medium px-3 py-2 rounded-md hover:brightness-95"
                style={{ background: COLORS.yellow, color: '#000' }}>
                <FileText size={16}/> Documentos del proyectos
              </button>
            </div>
          </div>

          {/* 4 stats en grid 2×2 */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={<CalendarClock size={16} />} title="FPO vigente" value={fmtDate(proyecto.fpo.vigente)} hint="Res. MME 403150 de 2025" />
            <StatCard icon={<CalendarDays size={16} />} title="FPO inicial" value={fmtDate(proyecto.fpo.inicial)} />
            <StatCard icon={<CalendarRange size={16} />} title="FPO estimada interconexión" value={fmtDate(proyecto.fpo.estimadaInter)} hint="Actualizado el 4/7/2025" />
            <StatCard icon={<FileText size={16} />} title="No. de cambios FPO" value={`${proyecto.fpo.cambios} cambios`} />
          </div>
        </div>

        {/* ===== Avances ===== */}
        <h3 className="text-xl font-semibold mt-7 mb-3" style={{ color: COLORS.heading }}>Avances</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SmallMetricCard
            icon={<Factory size={16} />}
            title="Subestaciones"
            value={`${proyecto.avances.subestaciones}% de avance`}
            updated={proyecto.avances.updated}
          />
          <SmallMetricCard
            icon={<Cable size={16} />}
            title="Líneas de transmisión"
            value={`${proyecto.avances.lineas}% de avance`}
            updated={proyecto.avances.updated}
          />
          {/* Slider a la derecha con flechas */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-3 relative overflow-hidden">
            <img src={carouselImgs[slide]} alt="Galería" className="w-full h-56 object-cover rounded-lg" />
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/80"
              aria-label="Anterior"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/80"
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselImgs.map((_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i === slide ? 'bg-white' : 'bg-white/40'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Desfase cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <SmallMetricCard icon={<AlertTriangle size={16} />} title="Desfase del Proyecto" value={`${proyecto.avances.desfaseDias} días`} updated="4/7/2025" />
          <SmallMetricCard icon={<AlertTriangle size={16} />} title="Desfase del Proyecto" value={`${proyecto.avances.desfaseDias} días`} updated="4/7/2025" />
        </div>

        {/* Tramos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {proyecto.tramos.map((t, i) => (
            <ProgressCard key={i} title={t.titulo} bars={t.barras} />
          ))}
        </div>

        {/* Subestaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {proyecto.subestaciones.map((s, i) => (
            <ProgressCard key={i} title={s.titulo} bars={s.barras} />
          ))}
        </div>
      </div>

      {/* ===== Ubicación y detalles ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.heading }}>Ubicación y detalles</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Mapa ilustrativo (imagen para el mock) */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-3 lg:col-span-2">
            <img src="../src/assets/images/mapa_interno.png" alt="Mapa" className="w-full h-[300px] object-cover rounded-lg" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <div className="flex items-center gap-2" style={{ color: COLORS.label }}>
                <IconPill><MapPin size={16} /></IconPill> Departamento
              </div>
              <div className="mt-2 text-white">Santander, Boyacá y Cundinamarca</div>
            </div>

            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <DotLabel text="Tramo y nivel de tensión" />
              <div className="mt-2 text-white">Sogamoso – Norte 500 kV</div>
            </div>

            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <DotLabel text="Tramo y nivel de tensión" />
              <div className="mt-2 text-white">Norte – Nueva Esperanza (Tequendama) 500 kV</div>
            </div>
          </div>
        </div>

        {/* KPIs generación */}
        <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: COLORS.heading }}>
          Proyectos de generación que se conectarán
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.label }}>
              <IconPill><Gauge size={16} /></IconPill> Número total
            </div>
            <div className="text-white text-lg font-semibold">{proyecto.generacion.totalProyectos} proyectos</div>
          </div>
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.label }}>
              <IconPill><Zap size={16} /></IconPill> Total en MW
            </div>
            <div className="text-white text-lg font-semibold">{proyecto.generacion.totalMW} MW</div>
          </div>
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.label }}>
              <IconPill><Sun size={16} /></IconPill> Solares
            </div>
            <div className="text-white text-lg font-semibold">{proyecto.generacion.solares} proyectos</div>
          </div>
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.label }}>
              <IconPill><Wind size={16} /></IconPill> Eólicos
            </div>
            <div className="text-white text-lg font-semibold">{proyecto.generacion.eolicos} proyectos</div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}

