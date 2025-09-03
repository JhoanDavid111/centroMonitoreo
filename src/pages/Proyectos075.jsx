import { useState } from 'react';

import {
  Banner,
  BannerBackground,
  BannerHeader,
  BannerLogo,
  BannerTitle,
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
          src="../../src/assets/bannerProyectosEstrategia6GW.png"
          title="Banner Background"
          alt="Banner Background"
        />
        <BannerHeader>
          <BannerTitle>
            Proyectos de Generación
            <div className='absolute left-6 top-20 mt-10 text-2xl'>Ventanilla única resolución CREG 075</div>
          </BannerTitle>
        </BannerHeader>
        <BannerLogo src={GWOff} title="Logo" alt="Logo" />
      </Banner>

      <div className="mb-4 flex flex-wrap items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCiclos(false)}
            className={`flex items-center space-x-1 rounded px-3 py-1 font-sans transition ${
              !showCiclos
                ? 'bg-[#FFC800] text-black hover:bg-[#e6b000]'
                : 'bg-[#3a3a3a] text-white'
            }`}
          >
            Seguimiento de proyectos 075
          </button>
          <button
            onClick={() => setShowCiclos(true)}
            className={`flex items-center space-x-1 rounded px-3 py-1 font-sans transition ${
              showCiclos
                ? 'bg-[#FFC800] text-black hover:bg-[#e6b000]'
                : 'bg-[#3a3a3a] text-white'
            }`}
          >
            Seguimiento de ciclos de asignación
          </button>
        </div>
      </div>

      {!showCiclos ? (
        <div id="proyectos-tab">
          <div className="rounded-lg bg-[#262626] p-6">
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
