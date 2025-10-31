// src/pages/PageProjectTransmision.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProjectData } from '../service/apiServiceConvocatoriaTransmision';
import {
  ChevronLeft, FileText,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

// Assets
import imgsubestacion from '../assets/images/subestacion.jpg';
import imgSliderTransm1 from '../assets/images/Slider_transmision1.png';
import imgSliderTransm2 from '../assets/images/Slider_transmision2.png';
import imgSliderTransm3 from '../assets/images/Slider_transmision3.png';

import MapaProyectosTransmision from '../components/MapaProyectosTransmision';

import iconSubestacionAvance from '../assets/svg-icons/Demanda-On.svg';
import iconLineaTransmision from '../assets/svg-icons/Transmision-On.svg';
import iconCalendar from '../assets/svg-icons/calendarDarkmodeAmarillo.svg';
import iconCambio from '../assets/svg-icons/Process-On.svg';
import iconNumProyectos from '../assets/svg-icons/Proyecto075-On.svg';
import iconTotalMW from '../assets/svg-icons/EnergiaElectrica-On.svg';
import iconSolar from '../assets/svg-icons/Autogeneracion-On.svg';
import iconEolico from '../assets/svg-icons/Eolica-On.svg';

import IndicatorCard from '../components/ui/IndicatorCard';

import Carousel from "../components/Carousel";

// Definir imágenes
const mainCarouselImgs = [
  imgsubestacion,
  imgSliderTransm1,
  imgSliderTransm2,
  imgSliderTransm3
];

const secondaryCarouselImgs = [
  imgSliderTransm1,
  imgSliderTransm2,
  imgSliderTransm3
];

const CONNECTIONS_CONFIG = {
  totalProyectos: { label: "Número total", icon: <img src={iconNumProyectos} alt="Total Proyectos" className="h-6 w-6" />, suffix: " proyectos", showHelp: true },
  totalMW: { label: "Total en MW", icon: <img src={iconTotalMW} alt="Total en MW" className="h-6 w-6" />, suffix: " MW", showHelp: true },
  solares: { label: "Solares", icon: <img src={iconSolar} alt="Solar" className="h-6 w-6" />, suffix: " proyectos", showHelp: true },
  eolicos: { label: "Eólicos", icon: <img src={iconEolico} alt="Eólico" className="h-6 w-6" />, suffix: " proyectos", showHelp: true }
};

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

/* ===== Cards ===== */
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

const SmallMetricCard = ({ icon, title, value, updated }) => (
  <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm font-medium" style={{ color: COLORS.label }}>{title}</span>
    </div>
    <p className="text-lg font-semibold">{value}</p>
    {updated && <p className="text-xs mt-1" style={{ color: COLORS.label }}>Actualizado: {fmtDate(updated)}</p>}
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

  const carouselImgs = [imgSliderTransm1, imgSliderTransm2, imgSliderTransm3];

  // Se adiciona para que se cargue la información o ancle cada vez que cambia el projectId
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [projectId]);

  useEffect(() => {
    const getProject = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (!projectId) {
          throw new Error("No se especificó un ID de proyecto");
        }

        const data = await fetchProjectData(projectId);
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
      <div className="w-full px-2 pt-4">
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
      <div className="w-full px-2">
        <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.heading }}>Fechas de puesta en operación</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Imagen + botón - Ahora con carrusel */}
          <div className="lg:col-span-2 bg-[#262626] border border-[#3a3a3a] rounded-xl p-3">
            <Carousel images={mainCarouselImgs} height="h-72 md:h-96" interval={5000} />
            <div className="mt-3">
              <button
                onClick={() => window.open(projectData.documents, '_blank')}
                className="inline-flex items-center gap-2 font-medium px-3 py-2 rounded-md hover:brightness-95"
                style={{ background: COLORS.yellow, color: '#000' }}>
                <FileText size={16} /> Documentos de la convocatoria
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {projectData.milestones.map((milestone, index) => (
              <IndicatorCard
                key={index}
                icon={
                  index === 0 ? <img src={iconCalendar} alt="FPO vigente" className="h-6 w-6" /> :
                    index === 1 ? <img src={iconCalendar} alt="FPO inicial" className="h-6 w-6" /> :
                      index === 2 ? <img src={iconCalendar} alt="FPO Estimada" className='h-6 w-6' /> :
                        <img src={iconCambio} alt="No Cambios FPO" className='h-6 w-6' />
                }
                label={milestone.title}
                value={milestone.title.includes('cambios') ? `${milestone.value}` : fmtDate(milestone.value)}
                update={milestone.updated ? `Actualizado: ${fmtDate(milestone.updated)}` : null}
              />
            ))}
          </div>
        </div>

        {/* Avances */}
        <h3 className="text-xl font-semibold mt-7 mb-3" style={{ color: COLORS.heading }}>Avances</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {projectData.progressSummary.map((progress, index) => (
            <IndicatorCard
              key={index}
              icon={index === 0
                ? <img src={iconSubestacionAvance} alt="Subestación" className="h-6 w-6" />
                : <img src={iconLineaTransmision} alt="Transmisión" className='h-6 w-6' />}
              label={progress.title}
              value={`${progress.percentage}% de avance`}
              updated={progress.updated}
            />
          ))}

          {/* Carrusel adicional - Manteniendo el mismo tamaño */}
          <div className="md:col-span-2 bg-[#262626] border border-[#3a3a3a] rounded-xl p-3">
           <Carousel images={secondaryCarouselImgs} height="h-56" interval={5000} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {projectData.subestaciones.map((subestacion, i) => (
                <ProgressCard key={i} title={subestacion.title} bars={subestacion.barras} />
              ))}
            </div>
          </>
        )}

        {/* Ubicación */}
        <div className="w-full mt-10">
          {projectData.mapEmbedUrl && (
            <MapaProyectosTransmision
              mapUrl={projectData.mapEmbedUrl}
              title={`Ubicación del proyecto: ${projectData.header.title}`}
            />
          )}

          {/* KPIs generación - Solo se mostrara si hay al menos un valor diferente de 0 o null*/}
          {Object.values(projectData.connections).some(value => value !== 0 && value !== null) && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: COLORS.heading }}>
                Proyectos de generación que se conectarán
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(projectData.connections).map(([key, value]) => {
                  const config = CONNECTIONS_CONFIG[key];
                  if (!config) return null;
                  return (
                    <IndicatorCard
                      key={key}
                      icon={config.icon}
                      label={config.label}
                      value={`${value}${config.suffix || ""}`}
                      showHelp={config.showHelp || false}
                    />
                  );
                })}
              </div>
            </>
          )}

          {/* Nueva card de beneficios del proyecto */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.heading }}>Beneficios del proyecto</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span style={{ color: COLORS.label }}>Reducir necesidad de generación local y mejorar la confiabilidad y seguridad.</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span style={{ color: COLORS.label }}>Habilitará proyectos de generación en la región.</span>
              </li>
            </ul>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default PageProjectTransmision;        