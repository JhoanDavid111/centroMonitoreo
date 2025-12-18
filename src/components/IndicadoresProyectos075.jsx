// src/components/IndicadoresProyectos075.jsx
import { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';

import TooltipModal from './ui/TooltipModal';
import { useTooltipsCache } from '../hooks/useTooltipsCache';
import { useIndicadoresProyectos075 } from '../services/indicadoresService';
import Card from './ui/Card';
import tokens from '../styles/theme.js';

// Íconos
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';
import EnergiaAmarillo     from '../assets/svg-icons/Energia-Amarillo.svg';
import EnergiaElectricaOn  from '../assets/svg-icons/EnergiaElectrica-On.svg';
import Proyecto075On       from '../assets/svg-icons/Proyecto075-On.svg';
import OfertaDemandaOn     from '../assets/svg-icons/OfertaDemanda-On.svg';
import MinusDarkOn         from '../assets/svg-icons/minusDark-On.svg';

// Mapeo tarjeta → tooltip
const CARD_TO_TOOLTIP_MAP = {
  total_proyectos_aprobados_bd075: 'proy_card_solicitudes_totales',
  total_capacidad_instalada_bd075: 'proy_card_en_operacion',
  total_capacidad_instalada_aprobados_bd075: 'proy_card_en_operacion_fncer',
  total_proyectos_curva_s: 'proy_card_solicitudes_aprobadas_entrar',
  proyectos_aprobados_no_curva_s: 'proy_card_fncer_con_fpo',
};

// Textos base
const LABEL_MAP = {
  total_proyectos_bd075: {
    label: 'Proyectos aprobados por entrar con FPO a 7 de agosto de 2026 =',
    icon: EnergiaAmarillo,
    value: '',
  },
  total_proyectos_aprobados_bd075: {
    label: 'Solicitudes totales',
    icon: Proyecto075On,
    value: '',
  },
  total_capacidad_instalada_bd075: {
    label: 'Proyectos en operación',
    icon: EnergiaElectricaOn,
    value: '',
  },
  total_capacidad_instalada_aprobados_bd075: {
    label: 'Proyectos en operación FNCER',
    icon: EnergiaElectricaOn,
    value: '',
  },
  total_proyectos_curva_s: {
    label: 'Solicitudes aprobadas FNCER por entrar',
    icon: OfertaDemandaOn,
    value: '',
  },
  proyectos_aprobados_no_curva_s: {
    label: 'Proyectos FNCER con FPO vencida',
    icon: MinusDarkOn,
    value: '',
  },
};

// Orden de tarjetas
const ORDER = [
  'total_proyectos_aprobados_bd075',
  'total_capacidad_instalada_bd075',
  'total_capacidad_instalada_aprobados_bd075',
  'total_proyectos_curva_s',
  'proyectos_aprobados_no_curva_s',
];

// Helpers
function cleanSubtitle(raw) {
  return String(raw || '').replace(/\s*=\s*$/, '');
}
const nf0 = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const fmtMW = (mw) => nf2.format(mw ?? 0);

export default function IndicadoresProyectos075({ wrapperClassName = '' }) {
  const [labels, setLabels] = useState(LABEL_MAP);
  const [updated, setUpdated] = useState(new Date().toLocaleDateString('es-CO'));

  // Tooltips (cache)
  const { tooltips, loading: loadingTooltips, error: errorTooltips } = useTooltipsCache();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle]   = useState('');
  const [modalContent, setModalContent] = useState('');
  const closeModal = () => { setIsModalOpen(false); setModalTitle(''); setModalContent(''); };

  const handleHelpClick = (cardkey) => {
    const tooltipId = CARD_TO_TOOLTIP_MAP[cardkey];
    const title = labels[cardkey]?.label || 'Indicador';
    const content = tooltips[tooltipId];

    setModalTitle(cleanSubtitle(title));
    setModalContent(content || 'No hay información disponible en este momento.');
    setIsModalOpen(true);
  };

  // Datos API
  const { data, isLoading: loading, error: queryError } = useIndicadoresProyectos075();

  useEffect(() => {
    if (!data) return;
    try {
      const next = { ...LABEL_MAP };

      const nAprobEntrar = data.total_proyectos_aprobados_a_entrar_agosto_2026 ?? 0;
      const mwAprobEntrar = data.capacidad_proyectos_aprobados_a_entrar_agosto_2026 ?? 0;
      next.total_proyectos_bd075.value = `${nf0.format(nAprobEntrar)} proyectos (${fmtMW(mwAprobEntrar)} MW)`;

      next.total_proyectos_aprobados_bd075.value = `${nf0.format(data.total_solicitudes ?? 0)}`;
      next.total_capacidad_instalada_bd075.value = `${nf0.format(data.total_proyectos_operacion ?? 0)}  (${fmtMW(data.capacidad_proyectos_operacion_mw ?? 0)} MW)`;
      next.total_capacidad_instalada_aprobados_bd075.value = `${nf0.format(data.total_proyectos_operacion_fncer ?? 0)} (${fmtMW(data.capacidad_proyectos_operacion_fncer_mw ?? 0)} MW)`;
      next.total_proyectos_curva_s.value = `${nf0.format(data.total_solicitudes_aprobadas ?? 0)} (${fmtMW(data.capacidad_solicitudes_aprobadas_mw ?? 0)} MW)`;
      next.proyectos_aprobados_no_curva_s.value = `${nf0.format(data.total_fncer_vencidos ?? 0)}  (${fmtMW(data.capacidad_fncer_vencidos_mw ?? 0)} MW)`;

      setLabels(next);
      setUpdated(new Date().toLocaleDateString('es-CO'));
    } catch (e) {
      console.error('Error procesando indicadores:', e);
    }
  }, [data]);

  const heroSubtitle = cleanSubtitle(labels.total_proyectos_bd075.label);
  const heroValue    = labels.total_proyectos_bd075.value;

  // ===== Loading / Error (con fondo #111111 y sin bordes) =====
  if (loading || loadingTooltips) {
    return (
      <section
        className={`bg-[#111111] px-4 py-6 !border-0 !shadow-none ${wrapperClassName}`}
        style={{ border: 0, boxShadow: 'none', outline: 'none' }}
      >
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#1a1a1a] rounded w-1/2 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {ORDER.map((_, i) => (
              <Card key={i} className="p-5">
                <div className="h-6 bg-[#1a1a1a] rounded mb-4" />
                <div className="h-8 bg-[#222] rounded mb-2" />
                <div className="h-3 bg-[#1a1a1a] rounded w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (queryError || errorTooltips) {
    return (
      <section
        className={`bg-[#111111] px-4 py-6 !border-0 !shadow-none ${wrapperClassName}`}
        style={{ border: 0, boxShadow: 'none', outline: 'none' }}
      >
        <div className="text-red-400 p-6">Error: {queryError?.message || errorTooltips || 'Error al cargar los indicadores'}</div>
      </section>
    );
  }

  const cards = ORDER.map((key) => ({
    key,
    icon: labels[key].icon,
    label: labels[key].label,
    value: labels[key].value,
  }));

  return (
    <section
      className={`bg-[#111111] px-4 py-6 !border-0 !shadow-none ${wrapperClassName}`}
      style={{ border: 0, boxShadow: 'none', outline: 'none' }}
    >
      {/* ───────── HERO sin borde y con fondo #111111 ───────── */}
      <div className="pt-2 text-center">
        <Card
          className="inline-flex flex-col items-center gap-4 px-8 py-6 md:flex-row md:justify-center border-0 shadow-none"
          style={{ backgroundColor: '#111111' }}
        >
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{ width: 64, height: 64, background: tokens.colors.accent.primary }}
          >
            <img src={EnergiaAmarillo} alt="Energía" className="w-12 h-12 md:w-14 md:h-14" />
          </span>
          <div className="text-left md:text-center">
            <p className="text-[color:var(--accent-primary)] text-3xl lg:text-5xl font-semibold leading-tight">
              {heroValue}
            </p>
            <p className="mt-2 text-text-secondary text-base lg:text-lg">
              {heroSubtitle}
            </p>
          </div>
        </Card>
      </div>

      {/* ───────── Tarjetas (mantienen #262626) ───────── */}
      <div className="px-0 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map(({ key, icon, label, value }) => (
            <Card key={key} className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <img src={icon} alt={label} className="w-6 h-6 flex-shrink-0" />
                <span className="text-[18px] font-medium leading-[26px] text-text-secondary">
                  {label}
                </span>
              </div>
              <div className="flex items-center text-text-primary text-2xl font-bold">
                {value}
                <HelpCircle
                  className="text-text-primary cursor-pointer hover:text-text-secondary transition-colors bg-surface-secondary self-center rounded h-6 w-6 p-1 ml-4"
                  title="Ayuda"
                  onClick={() => handleHelpClick(key)}
                />
              </div>
              <div className="text-xs text-text-muted mt-1">Actualizado el: {updated}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      <TooltipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalContent}
      />
    </section>
  );
}
