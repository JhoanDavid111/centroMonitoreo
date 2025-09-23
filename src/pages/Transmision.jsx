import bannerTransmision from '../../src/assets/bannerCentroMonitoreoTransmision.png';
import {
  Banner,
  BannerBackground,
  BannerHeader,
  BannerLogo,
  BannerTitle,
} from '../components/ui/Banner';

import { useTransmisionData } from '../components/transmision/hooks/useTransmisionData';
import TotalProyectos from '../components/transmision/TotalProyectos';
import ErrorMessage from '../components/ui/ErrorMessage';
import IndicatorCard from '../components/ui/IndicatorCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { TRANSMISION_CONFIG } from '../config/transmision';

//componentes especificos de la página
import MapaProyectosTransmision from '../components/MapaProyectosTransmision';
import TransmisionGrid from '../components/transmision/TransmisionGrid';

/* Iconos */
import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';

// URL del mapa fija
const MAPA_URL =
  'https://sig.upme.gov.co/portal/apps/experiencebuilder/experience/?id=75a09b50640c461a9d32ff4aa9eb4028';

export default function Transmision() {
  const { data, loading, error } = useTransmisionData();
  const updatedDate = new Date().toLocaleDateString('es-CO');

  if (loading) {
    return (
      <div className="space-y-8">
        <Banner>
          <BannerBackground
            src={bannerTransmision}
            title="Banner Background"
            alt="Banner Background"
          />
          <BannerHeader>
            <BannerTitle>Proyectos de transmisión en construcción</BannerTitle>
          </BannerHeader>

          <BannerLogo src={GWOff} title="Logo" alt="Logo" />
        </Banner>
        <SkeletonLoader cardCount={7} />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8">
      <Banner>
        <BannerBackground
          src={bannerTransmision}
          title="Banner Background"
          alt="Banner Background"
        />
        <BannerHeader>
          <BannerTitle>Proyectos de transmisión en construcción</BannerTitle>
        </BannerHeader>

        <BannerLogo src={GWOff} title="Logo" alt="Logo" />
      </Banner>
      <TotalProyectos total={data.total_proyectos} />
      <div className="px-2">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRANSMISION_CONFIG.indicators
            .filter(
              (indicator) => indicator.key !== 'convocatorias_proyectadas'
            )
            .map((indicator, i) => (
              <IndicatorCard
                key={i}
                icon={
                  <img
                    src={indicator.icon}
                    alt={indicator.label}
                    className="h-6 w-6"
                  />
                }
                label={indicator.label}
                value={data[indicator.key] || '8'}
                updated={updatedDate}
              />
            ))}
        </div>
      </div>

      <TransmisionGrid />

      <MapaProyectosTransmision
        mapUrl={MAPA_URL}
        title="Mapa de Proyectos de Transmisión"
      />
    </div>
  );
}
