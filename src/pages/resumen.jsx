import { lazy, Suspense } from 'react';
import bannerResumen from '../assets/bannerResumenEstrategia6GW.png';
import Plan6Svg from '../assets/Plan6gw+2.svg';
import {
  Banner,
  BannerAction,
  BannerBackground,
  BannerHeader,
  BannerTitle
} from '../components/ui/Banner';

// Componentes críticos cargados de forma normal (prioridad alta)
import { ResumenCharts } from '../components/ResumenCharts';
import { GeneracionDespacho } from '../components/GeneracionDespacho';
import Indicadores6GW from '../components/Indicadores6GW';

// Componentes menos críticos con lazy loading (prioridad baja)
const CapacidadInstalada = lazy(() => import('../components/CapacidadInstalada'));
const ComunidadesResumen = lazy(() => import('../components/ComunidadesResumen'));
const GeneracionHoraria = lazy(() => import('../components/GeneracionHoraria'));
const MapasCreg = lazy(() => import('../components/MapasCreg'));

// Componente de carga para Suspense
const LoadingFallback = ({ message = 'Cargando...' }) => (
  <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-[300px]">
    <div className="flex space-x-2">
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}></div>
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}></div>
    </div>
    <p className="text-gray-300 mt-4">{message}</p>
  </div>
);

export default function Resumen() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <Banner>
        <BannerBackground
          src={bannerResumen}
          title="Banner Background"
          alt="Banner Background"
        />
        <BannerHeader>
          <BannerTitle>Seguimiento
            <img
            draggable={false}
              className="w-100 object-cover h-6 md:h-10 lg:h-14 ml-3 shrink-0 inline-block select-none"
              src={Plan6Svg}
              alt="Plan 6GW+"
            />
          </BannerTitle>
          <BannerAction>
            <a
              href="https://app.upme.gov.co/Reportes_CentroMonitoreo/Reportes/Reporte_Resumen_CentroMonitoreo.pdf"
              target="_blank"
              rel="noreferrer noopener"
            >
              Descargar Resumen
            </a>
          </BannerAction>
        </BannerHeader>
      </Banner>

      {/* Aquí renderizamos el nuevo componente que maneja su propio fetch */}
      <Indicadores6GW />

      {/* Resto de secciones en el orden original */}
      <Suspense fallback={<LoadingFallback message="Cargando capacidad instalada..." />}>
        <div className="px-2">
          <CapacidadInstalada />
        </div>
      </Suspense>

      <Suspense fallback={<LoadingFallback message="Cargando comunidades energéticas..." />}>
        <div className="px-2">
          <ComunidadesResumen />
        </div>
      </Suspense>

      <ResumenCharts />

      <Suspense fallback={<LoadingFallback message="Cargando mapas CREG..." />}>
        <MapasCreg />
      </Suspense>

      <Suspense fallback={<LoadingFallback message="Cargando generación horaria..." />}>
        <GeneracionHoraria />
      </Suspense>

      <GeneracionDespacho />
    </div>
  );
}
