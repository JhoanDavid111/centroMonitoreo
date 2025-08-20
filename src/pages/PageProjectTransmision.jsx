// src/pages/PageProjectTransmision.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProjectData } from '../service/apiServiceConvocatoriaTransmision';
import {
  ChevronLeft, CalendarDays, CalendarClock, CalendarRange, FileText,
  AlertTriangle, Gauge, Zap, Cable, MapPin, Sun, Wind, Factory, Clock,
  ChevronRight
} from 'lucide-react';

// Assets
import imgsubestacion from '../assets/images/subestacion.jpg';
import imgSliderTransm1 from '../assets/images/Slider_transmision1.png';
import imgSliderTransm2 from '../assets/images/Slider_transmision2.png';
import imgSliderTransm3 from '../assets/images/Slider_transmision3.png';
import imgMapaInterno from '../assets/images/mapa_interno.png';
import MapaProyectosTransmision from '../components/MapaProyectosTransmision';

/* ===== Design tokens ===== */
const COLORS = {
   //pageBg: '#292929',
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
   if (!iso) return 'N/A';
  const [year, month, day] = iso.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // Mes base 0
  const mes = date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
  return `${String(date.getDate()).padStart(2, '0')}/${mes}/${date.getFullYear()}`;
};

const Bar = ({ value = 0, color = 'bg-emerald-500', track = 'bg-neutral-700' }) => (
  <div className={`h-3 w-full ${track} rounded-full overflow-hidden`}>
    <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

/* ===== UI Components ===== */
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
    {updated && (
      <div className="flex items-center gap-1 text-xs" style={{ color: COLORS.label }}>
        <Clock size={12} /> Actualizado el: {updated}
      </div>
    )}
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

const PageProjectTransmision = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');

 
  
  const [state, setState] = useState({
    projectData: null,
    loading: true,
    error: null
  });

  const [slide, setSlide] = useState(0);
  const carouselImgs = [imgSliderTransm1, imgSliderTransm2, imgSliderTransm3];
  
  const prev = () => setSlide((s) => (s - 1 + carouselImgs.length) % carouselImgs.length);
  const next = () => setSlide((s) => (s + 1) % carouselImgs.length);

  useEffect(() => {
    const getProject = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (!projectId) {
          throw new Error("No se especificó un ID de proyecto");
        }

        const data = await fetchProjectData(projectId);
        //console.log("Jagreda Datos del proyecto:", data);
        setState({
          projectData: data,
          loading: false,
          error: null
        });
      } catch (err) {
        setState({
          projectData: null,
          loading: false,
          error: err.message
        });
      }
    };

    getProject();
  }, [projectId]);

  const { projectData, loading, error } = state;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.pageBg }}>
      <div className="text-white">Cargando proyecto...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.pageBg }}>
      <div className="text-red-500 max-w-md text-center p-4">
        <AlertTriangle size={24} className="mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-2">Error al cargar el proyecto</h3>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: COLORS.yellow, color: '#000' }}
        >
          <ChevronLeft size={18} /> Volver a proyectos
        </button>
      </div>
    </div>
  );

  if (!projectData) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.pageBg }}>
      <div className="text-yellow-400 max-w-md text-center p-4">
        <h3 className="text-lg font-semibold mb-2">Proyecto no encontrado</h3>
        <p className="mb-4">No se encontraron datos para el proyecto {projectId}</p>
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: COLORS.yellow, color: '#000' }}
        >
          <ChevronLeft size={18} /> Volver a proyectos
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: COLORS.pageBg, color: COLORS.white }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold">{projectData.header.title}</h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: COLORS.yellow, color: '#000' }}
            
          >
            <ChevronLeft size={18} /> Volver
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Chip>Inversionista: {projectData.header.investor}</Chip>
          <Chip>Ubicación: {projectData.header.location}</Chip>
          <Chip>Etapa: {projectData.header.stage}</Chip>
          {projectData.progressSummary.some(p => p.hasDelay) && (
            <Chip className="bg-red-600/90 text-white border-red-700">
              <AlertTriangle size={14} /> {projectData.header.status}
            </Chip>
          )}
        </div>
      </div>

      {/* Fechas de puesta en operación */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.heading }}>Fechas de puesta en operación</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Imagen + botón */}
          <div className="lg:col-span-2 bg-[#262626] border border-[#3a3a3a] rounded-xl p-3">
            <div className="overflow-hidden rounded-lg">
              <img
                src={imgsubestacion}
                alt="Proyecto"
                className="w-full h-56 md:h-72 object-cover"
              />
            </div>
            <div className="mt-3">
              <button 
                onClick={() => window.open(projectData.documents, '_blank')}
                className="inline-flex items-center gap-2 font-medium px-3 py-2 rounded-md hover:brightness-95"
                style={{ background: COLORS.yellow, color: '#000' }}>
                <FileText size={16} /> Documentos del proyecto
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {projectData.milestones.map((milestone, index) => (
              <StatCard 
                key={index}
                icon={
                  index === 0 ? <CalendarClock size={16} /> :
                  index === 1 ? <CalendarDays size={16} /> :
                  index === 2 ? <CalendarRange size={16} /> :
                  <FileText size={16} />
                }
                title={milestone.title}
                value={milestone.title.includes('cambios') ? `${milestone.value} cambios` : fmtDate(milestone.value)}
                hint={milestone.updated ? `Actualizado: ${fmtDate(milestone.updated)}` : null}
              />
            ))}
          </div>
        </div>

        {/* Avances */}
        <h3 className="text-xl font-semibold mt-7 mb-3" style={{ color: COLORS.heading }}>Avances</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {projectData.progressSummary.map((progress, index) => (
            <SmallMetricCard
              key={index}
              icon={index === 0 ? <Factory size={16} /> : <Cable size={16} />}
              title={progress.title}
              value={`${progress.percentage}% de avance`}
              updated={progress.updated}
            />
          ))}
          
          {/* Carrusel */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-3 relative overflow-hidden">
            <img src={carouselImgs[slide]} alt="Galería" className="w-full h-56 object-cover rounded-lg" />
            <button 
              onClick={prev} 
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/80" 
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
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

        {/* Desfase */}
        {projectData.progressSummary.some(p => p.hasDelay) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <SmallMetricCard 
              icon={<AlertTriangle size={16} />} 
              title="Desfase del Proyecto" 
              value={`${projectData.progressSummary.find(p => p.hasDelay)?.delayDays || 0} días`} 
              updated={projectData.progressSummary.find(p => p.hasDelay)?.updated} 
            />
            <SmallMetricCard 
              icon={<AlertTriangle size={16} />} 
              title="Desfase Crítico" 
              value={`${projectData.progressSummary.find(p => p.hasDelay)?.delayDays || 0} días`} 
              updated={projectData.progressSummary.find(p => p.hasDelay)?.updated} 
            />
          </div>
        )}

        {/* Tramos */}
        {projectData.tramos.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mt-7 mb-3" style={{ color: COLORS.heading }}>Tramos</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {projectData.tramos.map((tramo, i) => (
                <ProgressCard key={i} title={tramo.title} bars={tramo.barras} />
              ))}
            </div>
          </>
        )}

        {/* Subestaciones */}
        {projectData.subestaciones.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mt-7 mb-3" style={{ color: COLORS.heading }}>Subestaciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {projectData.subestaciones.map((subestacion, i) => (
                <ProgressCard key={i} title={subestacion.title} bars={subestacion.barras} />
              ))}
            </div>
          </>
        )}

        {/* Ubicación */}
        <div className="max-w-7xl mx-auto px-4 mt-10">
          {/* <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.heading }}>Ubicación y detalles</h2> */}


          {projectData.mapEmbedUrl && (
            
            <MapaProyectosTransmision 
              mapUrl={projectData.mapEmbedUrl}
              title={`Ubicación del proyecto: ${projectData.header.title}`}
            />
          ) /* : (
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-3">
              <img
                src={imgMapaInterno}
                alt="Mapa"
                className="w-full object-cover rounded-lg"
              />
            </div>
          ) */
         }

         {/*  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-3 lg:col-span-2">
              <img 
                src={imgMapaInterno} 
                alt="Mapa" 
                className="w-full object-cover rounded-lg" 
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
                <div className="flex items-center gap-2" style={{ color: COLORS.label }}>
                  <IconPill><MapPin size={16} /></IconPill> Departamento
                </div>
                <div className="mt-2 text-white">{projectData.header.location}</div>
              </div>

              {projectData.tramos.map((tramo, i) => (
                <div key={i} className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
                  <DotLabel text={`Tramo ${i + 1}`} />
                  <div className="mt-2 text-white">{tramo.title}</div>
                </div>
              ))}
            </div>
          </div> */}

          {/* KPIs generación */}
          <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: COLORS.heading }}>
            Proyectos de generación que se conectarán
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.label }}>
                <IconPill><Gauge size={16} /></IconPill> Número total
              </div>
              <div className="text-white text-lg font-semibold">{projectData.connections.totalProyectos} proyectos</div>
            </div>
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.label }}>
                <IconPill><Zap size={16} /></IconPill> Total en MW
              </div>
              <div className="text-white text-lg font-semibold">{projectData.connections.totalMW} MW</div>
            </div>
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.label }}>
                <IconPill><Sun size={16} /></IconPill> Solares
              </div>
              <div className="text-white text-lg font-semibold">{projectData.connections.solares} proyectos</div>
            </div>
            <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1" style={{ color: COLORS.label }}>
                <IconPill><Wind size={16} /></IconPill> Eólicos
              </div>
              <div className="text-white text-lg font-semibold">{projectData.connections.eolicos} proyectos</div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default PageProjectTransmision;