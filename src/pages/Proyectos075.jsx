import { useState } from 'react';
import bannerProyectos from '../assets/bannerProyectosEstrategia6GW.png';
import {
  Banner,
  BannerBackground,
  BannerDescription,
  BannerHeader,
  BannerLogo,
  BannerTitle
} from '../components/ui/Banner';

import IndicadoresProyectos075 from '../components/IndicadoresProyectos075';
import ProjectGrid from '../components/ProjectGrid';
import SeguimientoCiclos from '../components/SeguimientoCiclos';
import SeguimientoIndices from '../components/SeguimientoIndices';

import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';

export default function Proyectos075() {
  const [showCiclos, setShowCiclos] = useState(false);

  return (
    <div className="min-h-screen font-sans text-white">
      <Banner>
        <BannerBackground
          src={bannerProyectos}
          title="Banner Background"
          alt="Banner Background"
        />
        <BannerHeader>
          <BannerTitle>Proyectos de Generación</BannerTitle>
          <BannerDescription>
              Ventanilla única resolución CREG 075
          </BannerDescription>
        </BannerHeader>
        <BannerLogo
          src={GWOff}
          title="Logo"
          alt="Logo"
        />
      </Banner>

      <div className="mb-4 flex flex-wrap items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowCiclos(false)}
          className={`flex items-center gap-1 px-3 py-2 rounded justify-center transition-colors w-full sm:w-auto
            ${!showCiclos
              ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
              : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
          `}
        >
          Seguimiento de proyectos 075
        </button>

        <button
          onClick={() => setShowCiclos(true)}
          className={`flex items-center gap-1 px-3 py-2 rounded justify-center transition-colors w-full sm:w-auto
            ${showCiclos
              ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
              : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'}
          `}
        >
          Seguimiento de ciclos de asignación
        </button>
        </div>
      </div>

      {!showCiclos ? (
        <div id="proyectos-tab">
          <div className="rounded-lg bg-surface-primary p-6">
            <IndicadoresProyectos075 />
          </div>
          <br />
          <div>
            <ProjectGrid />
          </div>
        </div>
      ) : (
        <div id="ciclos-tab">
          <div>
            <SeguimientoIndices />
          </div>
          <div>
            <SeguimientoCiclos />
          </div>
        </div>
      )}
    </div>
  );
}
