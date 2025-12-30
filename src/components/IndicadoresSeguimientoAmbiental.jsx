// src/components/IndicadoresSeguimientoAmbiental.jsx
import { useMemo, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import TooltipModal from './ui/TooltipModal';

// Iconos
import TramiteIcon from '../assets/svg-icons/TramitesServicos-Blanco.svg';
import ProyectoIcon from '../assets/svg-icons/ProyectoGeneracion-Amarillo.svg';
import TotalSolicitudesIcon from '../assets/svg-icons/tramites.svg';
import GeneracionIcon from '../assets/svg-icons/Autogeneracion-On.svg';
import TransmisionIcon from '../assets/svg-icons/Transmision-On.svg';
import DistribucionIcon from '../assets/svg-icons/Demanda-On.svg';

// ⬅️ Hook con React Query + apiClient (mismo patrón que Indicadores6GW)
import { useIndicadoresOASS } from '../services/indicadoresAmbientalesService';

/** Utilidad para formatear "2025-11" → "11/2025" */
const formatYYYYMMtoMMYYYY = (str) => {
  if (!str) return '';
  const [y, m] = String(str).split('-');
  return m && y ? `${m}/${y}` : str;
};

export default function IndicadoresSeguimientoAmbiental() {
  // ⬅️ Trae data como en Indicadores6GW: useQuery manejando cache/estados
  const { data, isLoading: loading, error } = useIndicadoresOASS();

  // Modal de ayuda
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const openTooltip = (title, content) => {
    setModalTitle(title || 'Detalle');
    setModalContent(content || 'No hay información adicional disponible para este indicador.');
    setIsModalOpen(true);
  };
  const closeTooltip = () => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalContent('');
  };

  // Derivar datos de API
  const { top, cards } = useMemo(() => {
    if (!data) {
      return {
        top: {
          proyectos: { valor: 0, label: 'proyectos', mes: '' },
          tramites:  { valor: 0, label: 'trámites',  mes: '' },
        },
        cards: [],
      };
    }

    const resumen = data.resumen || {};
    const periodo = resumen.periodo || '';
    const proyectosTotal = Number(resumen.proyectos?.total ?? 0);
    const tramitesTotal  = Number(resumen.tramites?.total  ?? 0);

    // Detalle por clasificación
    const detalle       = data.detalle_por_clasificacion || {};
    const totalDetalle  = Number(detalle.total ?? 0);
    const fechaDetalle  = formatYYYYMMtoMMYYYY(detalle.ultimaActualizacion);
    const porCat = Object.fromEntries(
      (detalle.detalle || []).map((d) => [d.categoria, Number(d.cantidad ?? 0)])
    );
    const safe = (k) => Number(porCat[k] ?? 0);

    const cards = [
      {
        id: 'total',
        icon: TotalSolicitudesIcon,
        titulo: 'Total de solicitudes',
        valor: totalDetalle || tramitesTotal,
        fecha: fechaDetalle || formatYYYYMMtoMMYYYY(resumen.ultimaActualizacion),
        tooltip: 'Total de solicitudes ambientales registradas en el periodo.',
      },
      {
        id: 'generacion',
        icon: GeneracionIcon,
        titulo: 'Generación',
        valor: safe('Generación'),
        fecha: fechaDetalle,
        tooltip: 'Solicitudes asociadas a proyectos de generación.',
      },
      {
        id: 'transmision',
        icon: TransmisionIcon,
        titulo: 'Transmisión',
        valor: safe('Transmisión'),
        fecha: fechaDetalle,
        tooltip: 'Solicitudes asociadas a proyectos de transmisión.',
      },
      {
        id: 'distribucion',
        icon: DistribucionIcon,
        titulo: 'Distribución',
        valor: safe('Distribución'),
        fecha: fechaDetalle,
        tooltip: 'Solicitudes asociadas a proyectos de distribución.',
      },
      {
        id: 'acogen',
        icon: TotalSolicitudesIcon,
        titulo: 'Solicitudes Acolgen',
        valor: safe('ACOLGEN'),
        fecha: fechaDetalle,
        tooltip: 'Solicitudes bajo el esquema Acolgen.',
      },
      {
        id: 'andesco',
        icon: TotalSolicitudesIcon,
        titulo: 'Solicitudes Andesco',
        valor: safe('ANDESCO'),
        fecha: fechaDetalle,
        tooltip: 'Solicitudes asociadas a Andesco.',
      },
      {
        id: 'ceera',
        icon: TotalSolicitudesIcon,
        titulo: 'Solicitudes Ceera',
        valor: safe('CEERA'),
        fecha: fechaDetalle,
        tooltip: 'Solicitudes asociadas a Ceera.',
      },
      {
        id: 'serco',
        icon: TotalSolicitudesIcon,
        titulo: 'Solicitudes SER CO',
        valor: safe('SER Colombia'),
        fecha: fechaDetalle,
        tooltip: 'Solicitudes asociadas a SER Colombia.',
      },
    ];

    const mesFmt = periodo ? periodo.charAt(0).toUpperCase() + periodo.slice(1) : '';

    return {
      top: {
        proyectos: { valor: proyectosTotal, label: 'proyectos', mes: mesFmt },
        tramites:  { valor: tramitesTotal,  label: 'trámites',  mes: mesFmt },
      },
      cards,
    };
  }, [data]);

  // === UI ===
  if (loading) {
    return (
      <div className="px-4 pt-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center py-16">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce" />
            <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce delay-150" />
            <div className="w-3 h-3 rounded-full bg-[#FFC800] animate-bounce delay-300" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const msg = typeof error === 'string' ? error : (error?.message || 'Error al cargar indicadores');
    return (
      <div className="px-4 pt-8">
        <div className="max-w-5xl mx-auto bg-[#262626] border border-red-500 text-red-400 rounded-xl p-4">
          Error al cargar indicadores: {msg}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ===== HEADER TOP (Proyectos / Trámites) ===== */}
      <div className="px-4 pt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
          {/* Proyectos */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-[#FFC800] flex items-center justify-center bg-transparent">
              <img src={ProyectoIcon} alt="Proyectos" className="w-20 h-20" draggable={false} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[#FFC800] text-[52px] font-semibold">{top.proyectos.valor}</span>
              <span className="text-[#FFC800] text-[32px] font-semibold -mt-2">{top.proyectos.label}</span>
              <span className="text-[#D1D1D0] text-base mt-1">{top.proyectos.mes}</span>
            </div>
          </div>

          {/* Trámites */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-white flex items-center justify-center bg-transparent">
              <img src={TramiteIcon} alt="Trámites" className="w-20 h-20" draggable={false} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white text-[52px] font-semibold">{top.tramites.valor}</span>
              <span className="text-white text-[32px] font-semibold -mt-2">{top.tramites.label}</span>
              <span className="text-[#D1D1D0] text-base mt-1">{top.tramites.mes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TÍTULO SECCIÓN ===== */}
      <div className="px-4 mt-10">
        <h2 className="text-2xl text-[#D1D1D0] font-semibold mb-4">Trámites solicitados en 2025</h2>
      </div>

      {/* ===== GRID TARJETAS ===== */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-[#262626] border border-[#666666] rounded-xl px-6 py-5 shadow flex flex-col justify-between"
            >
              {/* Header tarjeta */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <img src={card.icon} alt={card.titulo} className="w-6 h-6 flex-shrink-0" draggable={false} />
                  <span className="ml-2 text-[18px] font-normal leading-[26px] text-[#B0B0B0]">
                    {card.titulo}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openTooltip(card.titulo, card.tooltip)}
                  className="flex items-center justify-center h-7 w-7 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                  title="Ver detalle"
                >
                  <HelpCircle className="w-4 h-4 text-[#D1D1D0]" />
                </button>
              </div>

              {/* Valor */}
              <div className="mt-1">
                <span className="text-white text-[36px] font-semibold leading-none">
                  {Number.isFinite(card.valor) ? card.valor : 0}
                </span>
              </div>

              {/* Fecha */}
              <div className="mt-3 text-[11px] text-[#9CA3AF]">
                Actualizado el: {card.fecha || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MODAL TOOLTIP ===== */}
      <TooltipModal
        isOpen={isModalOpen}
        onClose={closeTooltip}
        title={modalTitle}
        content={modalContent}
      />
    </>
  );
}
