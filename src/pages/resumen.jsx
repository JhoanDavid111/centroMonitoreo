import {
  Banner,
  BannerBackground,
  BannerHeader,
  BannerTitle,
  BannerAction,
  BannerLogo,
} from '../components/ui/Banner';
import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';

import { ResumenCharts } from '../components/ResumenCharts';
import { CapacidadInstalada } from '../components/CapacidadInstalada';
import { GeneracionHoraria } from '../components/GeneracionHoraria';
import { GeneracionDespacho } from '../components/GeneracionDespacho';
import MapasCreg from '../components/MapasCreg';


import Indicadores6GW from '../components/Indicadores6GW'; // <-- nuevo

export default function Resumen() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <Banner>
        <BannerBackground
          src="../../src/assets/bannerResumenEstrategia6GW.png"
          title="Banner Background"
          alt="Banner Background"
        />
        <BannerHeader>
          <BannerTitle>Seguimiento
            <img
              className="w-100 object-cover h-6 md:h-10 lg:h-14 ml-3 shrink-0"
              src="../../src/assets/Plan6gw+2.svg"
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

      {/* Resto de secciones */}
      <div className="px-2">
        <CapacidadInstalada />
      </div>
      <ResumenCharts />
      <MapasCreg />
      <GeneracionDespacho />
      <GeneracionHoraria />
    </div>
  );
}
