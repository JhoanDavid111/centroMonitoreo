// src/pages/TransmisionDetalle.jsx
import React from 'react';
import {
  ChevronLeft, CalendarDays, CalendarClock, CalendarRange, Files, AlertTriangle,
  Gauge, Zap, Cable, MapPin, Map, Circle, Sun, Wind, Factory
} from 'lucide-react';

// ---- helpers ----
const fmtDate = d => new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
const Bar = ({ value = 0, color = 'bg-emerald-500', track = 'bg-neutral-700' }) => (
  <div className={`h-3 w-full ${track} rounded-full overflow-hidden`}>
    <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

// ---- tarjetas reutilizables ----
const Chip = ({ children, color = 'bg-neutral-700 text-gray-200', dot, dotColor='bg-emerald-400' }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${color}`}>
    {dot ? <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} /> : null}
    {children}
  </span>
);

const StatCard = ({ icon:Icon, title, value, hint, accent='#FFC800' }) => (
  <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
    <div className="flex items-center gap-2 mb-1 text-gray-300">
      <Icon size={18} className="text-gray-300" />
      <span>{title}</span>
    </div>
    <div className="text-2xl font-semibold" style={{ color: '#fff' }}>
      <span className="text-white">{typeof value === 'string' ? value : fmtDate(value)}</span>
    </div>
    {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
  </div>
);

const KPI = ({ icon:Icon, label, value, accent='#FFC800' }) => (
  <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
    <div className="flex items-center gap-2 text-gray-300 mb-2">
      <Icon size={18} />
      <span>{label}</span>
    </div>
    <div className="text-xl font-semibold" style={{ color: accent }}>{value}</div>
  </div>
);

const ProgressCard = ({ title, subtitle, bars = [], image }) => (
  <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-white font-semibold">{title}</h4>
      {subtitle ? <span className="text-xs text-gray-400">{subtitle}</span> : null}
    </div>
    {bars.map((b, i) => (
      <div key={i} className="mb-3">
        <div className="flex items-center justify-between text-sm text-gray-300 mb-1">
          <span>{b.label}</span><span>{b.value}%</span>
        </div>
        <Bar value={b.value} color={b.color} />
      </div>
    ))}
    {image && (
      <div className="mt-2 overflow-hidden rounded-lg">
        <img src={image} alt={title} className="w-full h-40 object-cover" />
      </div>
    )}
  </div>
);

// ---- datos mock (cámbialos cuando conectes APIs) ----
const proyecto = {
  nombre: 'UPME 01 – 2013 Sogamoso – Norte – Nueva Esperanza 500 kV',
  badges: [
    { txt: 'Inversionista: GEB Grupo Energía Bogotá' },
    { txt: 'Ubicación: Santander, Boyacá y Cundinamarca' },
    { txt: 'Etapa: Ejecución de obras' },
  ],
  estado: { txt: 'Estado: Desfase crítico', color: 'bg-red-600 text-white' },
  fpo: {
    vigente: '2025-12-26',
    inicial: '2017-09-30',
    estimadaInter: '2027-08-18',
    cambios: 12
  },
  avances: {
    subestaciones: 56,
    lineas: 35,
    desfaseDias: 950
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

// ---- mapa simple SVG para “Ubicación y detalles” ----
const MapaRuta = () => (
  <div className="bg-[#202020] border border-[#3a3a3a] rounded-xl p-3">
    <div className="rounded-lg overflow-hidden">
      <svg viewBox="0 0 600 380" className="w-full h-[300px] bg-[#1f1f1f]">
        <defs>
          <filter id="shadow"><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000" floodOpacity="0.6" /></filter>
        </defs>
        {/* “mapa” de fondo */}
        <rect x="0" y="0" width="600" height="380" fill="#1b1b1b"/>
        {/* Ruta en verde */}
        <path d="M120 40 C180 80 200 120 240 160 S320 240 360 260 420 300 480 320"
              stroke="#22c55e" strokeWidth="6" fill="none" filter="url(#shadow)"/>
        {/* Nodos (amarillos) */}
        {[
          { x:120,y:40, label:'SE Sogamoso' },
          { x:260,y:170, label:'SE Norte' },
          { x:480,y:320, label:'SE Nueva Esperanza' },
          { x:440,y:300, label:'SE Bacatá' },
        ].map((n,i)=>(
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="10" fill="#facc15" stroke="#111" strokeWidth="2"/>
            <rect x={n.x-50} y={n.y-30} width="100" height="20" rx="8" ry="8" fill="#2a2a2a" stroke="#3a3a3a"/>
            <text x={n.x} y={n.y-16} textAnchor="middle" fontSize="11" fill="#e5e5e5">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  </div>
);

// ---- página ----
export default function TransmisionDetalle() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* header */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight">
            {proyecto.nombre}
          </h1>
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2d2d2d] border border-[#3a3a3a] hover:bg-[#383838] text-sm"
          >
            <ChevronLeft size={18}/> Volver
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {proyecto.badges.map((b,i)=>(
            <Chip key={i}>{b.txt}</Chip>
          ))}
          <Chip color={proyecto.estado.color}><AlertTriangle size={14}/> {proyecto.estado.txt}</Chip>
        </div>
      </div>

      {/* Sección: Fechas de puesta en operación */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl text-[#D1D1D0] font-semibold mb-3">Fechas de puesta en operación</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* imagen grande izquierda */}
          <div className="lg:col-span-2 bg-[#262626] border border-[#3a3a3a] rounded-xl p-3">
            <div className="overflow-hidden rounded-lg">
              {/* reemplaza por tu imagen */}
              <img
                src="/assets/images/transmision-subestacion.jpg"
                alt="Subestación"
                className="w-full h-56 md:h-72 object-cover"
              />
            </div>
            <div className="mt-3">
              <button className="inline-flex items-center gap-2 bg-[#FFC800] text-black font-medium px-3 py-2 rounded-md hover:brightness-95">
                <Files size={16}/> Documentos del proyecto
              </button>
            </div>
          </div>

          {/* tarjetas de fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <StatCard icon={CalendarClock} title="FPO vigente" value={proyecto.fpo.vigente} hint="Res. MME 403150 de 2025" />
            <StatCard icon={CalendarDays} title="FPO inicial" value={proyecto.fpo.inicial} />
            <StatCard icon={CalendarRange} title="FPO estimada interconexión" value={proyecto.fpo.estimadaInter} hint="Actualizado el 4/7/2025" />
            <StatCard icon={Files} title="No. de cambios FPO" value={`${proyecto.fpo.cambios} cambios`} />
          </div>
        </div>

        {/* Avances */}
        <h3 className="text-xl text-[#D1D1D0] font-semibold mt-7 mb-3">Avances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-300 mb-1"><Factory size={18}/> Subestaciones</div>
            <div className="text-2xl font-semibold mb-2">{proyecto.avances.subestaciones}% de avance</div>
            <div className="text-xs text-gray-400 mb-2">Actualizado el 05/2025</div>
            <Bar value={proyecto.avances.subestaciones} color="bg-emerald-500"/>
          </div>
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-300 mb-1"><Cable size={18}/> Líneas de transmisión</div>
            <div className="text-2xl font-semibold mb-2">{proyecto.avances.lineas}% de avance</div>
            <div className="text-xs text-gray-400 mb-2">Actualizado el 05/2025</div>
            <Bar value={proyecto.avances.lineas} color="bg-emerald-500"/>
          </div>
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-300 mb-1"><AlertTriangle size={18}/> Desfase del Proyecto</div>
            <div className="text-2xl font-semibold mb-2">{proyecto.avances.desfaseDias} días</div>
            <div className="text-xs text-gray-400">Actualizado el 4/7/2025</div>
          </div>
        </div>

        {/* Tramos + carrusel de imagen (dummy) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2">
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-3">
              <div className="rounded-lg overflow-hidden relative">
                <img src="/assets/images/transmision-linea.jpg" alt="Línea de transmisión" className="w-full h-56 md:h-72 object-cover" />
                {/* mini dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0,1,2].map(i => <span key={i} className={`w-2 h-2 rounded-full ${i===1?'bg-white':'bg-white/40'}`} />)}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {proyecto.tramos.map((t,i)=>(
              <ProgressCard key={i} title={t.titulo} subtitle="Licencia ambiental" bars={t.barras}/>
            ))}
          </div>
        </div>

        {/* Subestaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {proyecto.subestaciones.map((s,i)=>(
            <ProgressCard key={i} title={s.titulo} subtitle="Licencia ambiental" bars={s.barras}/>
          ))}
        </div>
      </div>

      {/* Sección: Ubicación y detalles */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-xl text-[#D1D1D0] font-semibold mb-3">Ubicación y detalles</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MapaRuta/>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-300"><MapPin size={18}/> Departamento</div>
              <div className="mt-2 text-white">Santander, Boyacá y Cundinamarca</div>
            </div>
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-300"><Circle size={12} className="text-emerald-400"/> Tramo y nivel de tensión</div>
              <div className="mt-2 text-white">Sogamoso – Norte 500 kV</div>
            </div>
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-300"><Circle size={12} className="text-emerald-400"/> Tramo y nivel de tensión</div>
              <div className="mt-2 text-white">Norte – Nueva Esperanza (Tequendama) 500 kV</div>
            </div>
          </div>
        </div>

        {/* KPIs de generación que se conectarán */}
        <h3 className="text-xl text-[#D1D1D0] font-semibold mt-6 mb-3">Proyectos de generación que se conectarán</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI icon={Gauge} label="Número total" value={`${proyecto.generacion.totalProyectos} proyectos`} />
          <KPI icon={Zap} label="Total en MW" value={`${proyecto.generacion.totalMW} MW`} />
          <KPI icon={Sun} label="Solares" value={`${proyecto.generacion.solares} proyectos`} />
          <KPI icon={Wind} label="Eólicos" value={`${proyecto.generacion.eolicos} proyectos`} />
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
