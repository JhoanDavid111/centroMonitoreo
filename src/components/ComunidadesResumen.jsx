// src/components/ComunidadesResumen.jsx
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

// Íconos desde assets/svg-icons
import ComunidadesEnergIcon from '../assets/svg-icons/ComunidadesEnerg-On.svg';
import ParticipaIcon from '../assets/svg-icons/participa.svg';
import TramitesIcon from '../assets/svg-icons/tramites.svg';
import FocalizadasIcon from '../assets/svg-icons/Demanda-On.svg';
import ConvocatoriasIcon from '../assets/svg-icons/convocatorias.svg';

// ===== Textos y asignación de íconos =====
const LABEL_MAP = {
  postuladas_1: {
    label: 'No. de comunidades postuladas',
    icon: ParticipaIcon,
    value: '20 (00MW)',
  },
  registradas_1: {
    label: 'No. de comunidades registradas',
    icon: TramitesIcon,
    value: '97 (00MW)',
  },
  focalizadas_1: {
    label: 'No. de comunidades focalizadas',
    icon: FocalizadasIcon,
    value: '97 (00MW)',
  },
  priorizadas_1: {
    label: 'No. de comunidades priorizadas',
    icon: ConvocatoriasIcon,
    value: '8 (00MW)',
  },
  postuladas_2: {
    label: 'No. de comunidades postuladas',
    icon: ParticipaIcon,
    value: '20 (00MW)',
  },
  registradas_2: {
    label: 'No. de comunidades registradas',
    icon: TramitesIcon,
    value: '97 (00MW)',
  },
  focalizadas_2: {
    label: 'No. de comunidades focalizadas',
    icon: FocalizadasIcon,
    value: '97 (00MW)',
  },
  priorizadas_2: {
    label: 'No. de comunidades priorizadas',
    icon: ConvocatoriasIcon,
    value: '8 (00MW)',
  },
};

// Orden exacto (8 tarjetas)
const ORDER = [
  'postuladas_1',
  'registradas_1',
  'focalizadas_1',
  'priorizadas_1',
  'postuladas_2',
  'registradas_2',
  'focalizadas_2',
  'priorizadas_2',
];

export default function ComunidadesResumen() {
  const [expanded, setExpanded] = useState(false);
  const updated = '8/5/2025'; // Fijo para que coincida con el mock

  const cards = ORDER.map((key) => ({
    key,
    icon: LABEL_MAP[key].icon,
    label: LABEL_MAP[key].label,
    value: LABEL_MAP[key].value,
  }));

  return (
    <div className="px-2 mb-8">
      {/* Botón para expandir */}
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="bg-[#FFC800] hover:bg-yellow-400 text-black px-6 py-3 rounded transition font-medium"
        >
          Comunidades energéticas
        </button>
      ) : (
        <>
          {/* Encabezado con ícono sin fondo */}
          <div className="flex items-center gap-2 mb-4 mt-2">
            <img
              src={ComunidadesEnergIcon}
              alt="Icono Comunidades Energéticas"
              className="w-6 h-6"
            />
            <h3 className="text-[20px] font-semibold text-[#B0B0B0]">
              Comunidades Energéticas
            </h3>
          </div>

          {/* Tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map(({ key, icon, label, value }) => (
              <div
                key={key}
                className="bg-[#262626] p-5 rounded-lg border border-[#666666] shadow"
              >
                <div className="flex items-center mb-2">
                  <img src={icon} alt={label} className="w-6 h-6 flex-shrink-0" />
                  <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                    {label}
                  </span>
                </div>

                <div className="flex text-white text-2xl font-bold">
                  {value}
                  <HelpCircle
                    className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 self-center rounded h-6 w-6 p-1 ml-4"
                    title="Ayuda"
                  />
                </div>

                <div className="text-xs text-[#B0B0B0] mt-1">
                  Actualizado el: {updated}
                </div>
              </div>
            ))}
          </div>

          {/* Botón para retraer */}
          <div className="mt-6">
            <button
              onClick={() => setExpanded(false)}
              className="bg-[#FFC800] hover:bg-yellow-400 text-black px-6 py-3 rounded transition font-medium"
            >
              Ver menos
            </button>
          </div>
        </>
      )}
    </div>
  );
}


