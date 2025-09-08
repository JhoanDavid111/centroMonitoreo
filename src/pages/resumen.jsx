import bannerResumen from '../../src/assets/bannerResumenEstrategia6GW.png';
import Plan6Svg from '../../src/assets/Plan6gw+2.svg';
import {
  Banner,
  BannerAction,
  BannerBackground,
  BannerHeader,
  BannerTitle
} from '../components/ui/Banner';

import { CapacidadInstalada } from '../components/CapacidadInstalada';
import ComunidadesResumen from '../components/ComunidadesResumen';
import { GeneracionDespacho } from '../components/GeneracionDespacho';
import { GeneracionHoraria } from '../components/GeneracionHoraria';
import MapasCreg from '../components/MapasCreg';
import { ResumenCharts } from '../components/ResumenCharts';


import Indicadores6GW from '../components/Indicadores6GW'; // <-- nuevo

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

      {/* Resto de secciones */}
      <div className="px-2">
        <CapacidadInstalada />
      </div>
      <div className="px-2">
        <ComunidadesResumen />
      </div>
      <ResumenCharts />
      <MapasCreg />
      <GeneracionDespacho />
      <GeneracionHoraria />
    </div>
  );
}
