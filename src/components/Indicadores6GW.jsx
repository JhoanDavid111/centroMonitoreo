// src/components/Indicadores6GW.jsx
import { useEffect, useMemo, useState } from 'react';
import { HelpCircle, Bolt } from 'lucide-react';

import GWOff from '../assets/svg-icons/6gw+NewIcon.svg';
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';
import ProcessOn from '../assets/svg-icons/Process-On.svg';
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg';
import EolicaOn from '../assets/svg-icons/Eolica-On.svg';
import HidrologiaOn from '../assets/svg-icons/Hidrologia-On.svg';
import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg';
import CasaOn from '../assets/svg-icons/Casa-On.svg';
import TerritorioOn from '../assets/svg-icons/Territorio-On.svg';

import EnergiaAmarillo from '../assets/svg-icons/6GW-off-act_.svg';

import { useNavigate } from 'react-router-dom';
import TooltipModal from './ui/TooltipModal';
import Card from './ui/Card';

import { useIndicadores6GW } from '../services/indicadoresService';
import { useTooltips } from '../services/tooltipsService';
import tokens from '../styles/theme.js';

// ─────────────────────────────────────────────────────────────────────────────
// Normalización y mapeo canónico
// ─────────────────────────────────────────────────────────────────────────────
function stripAccents(s = '') {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function canonicalKey(raw = '') {
  const clean = stripAccents(String(raw).trim()).toUpperCase();

  if (clean === 'EN OPERACION') return 'EN OPERACIÓN';
  if (clean === 'PRUEBAS') return 'PRUEBAS';
  if (clean === 'AGGE') return 'AGGE';
  if (clean === 'AGPE') return 'AGPE';
  if (
    clean === 'FNCER GRAN ESCALA' ||
    clean === 'FNCER' ||
    clean === 'FNCER GRAN-ESCALA' ||
    clean === 'FNCER A GRAN ESCALA' ||
    clean === 'FNCER GRAN  ESCALA'
  ) return 'FNCER GRAN ESCALA';

  if (clean === 'GENERACION DISTRIBUIDA') return 'GENERACION DISTRIBUIDA';
  if (clean === 'CAPACIDAD A ENTRAR 075') return 'CAPACIDAD A ENTRAR 075';
  if (clean === 'CAPACIDAD TOTAL') return 'CAPACIDAD TOTAL';

  return clean; // fallback
}

// ⛔️ Claves a ocultar (según lo que llega del API después de canonicalizar)
const EXCLUDE_KEYS = new Set([
  'AUTOGENERADOR',
  'GEN. DISTRIBUIDA',
  'NORMAL',
]);

// MAPEO DE CLAVE CANONICA A IDENTIFICADOR DE TOOLTIP
const TOOLTIP_IDENTIFIERS_MAP = {
  'EN OPERACIÓN': 'res_card_capacidad_inst_operacion',
  'PRUEBAS': 'res_card_capacidad_inst_prueba',
  'CAPACIDAD A ENTRAR 075': 'res_card_mw',
  'FNCER GRAN ESCALA': 'res_card_fncer',
  'AGGE': 'res_card_agge',
  'GENERACION DISTRIBUIDA': 'res_card_gd',
  'AGPE': 'res_card_agpe',
  'ZNI': 'res_card_zni',
};

const LABEL_MAP = {
  total_proyectos_bd075: {
    label: 'Capacidad total instalada 6GW+ =',
    icon: EnergiaAmarillo,
  },
  'EN OPERACIÓN': { label: 'Capacidad instalada en operación', icon: DemandaOn },
  'PRUEBAS': { label: 'Capacidad instalada en pruebas', icon: ProcessOn },
  'CAPACIDAD A ENTRAR 075': { label: 'MW por entrar a julio de 2026', icon: Proyecto075On },
  'FNCER GRAN ESCALA': { label: 'FNCER gran escala', icon: EolicaOn },
  'AGGE': { label: 'Autogeneración a gran escala (AGGE)', icon: HidrologiaOn },
  'GENERACION DISTRIBUIDA': { label: 'Generación distribuida (GD)', icon: AutogeneracionOn },
  'AGPE': { label: 'Autogeneración a pequeña escala (AGPE)', icon: CasaOn },
  'ZNI': { label: 'Zonas no interconectadas (ZNI)', icon: TerritorioOn, special: true },
};

const ORDER = [
  'EN OPERACIÓN',
  'PRUEBAS',
  'CAPACIDAD A ENTRAR 075',
  'FNCER GRAN ESCALA',
  'AGGE',
  'GENERACION DISTRIBUIDA',
  'AGPE',
  'ZNI',
];

// Helpers
function cleanSubtitle(raw) {
  return String(raw || '').replace(/\s*=\s*$/, '');
}
const formatMW = (n) =>
  Number(n ?? 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────
export default function Indicadores6GW() {
  const { data, isLoading: loading, error } = useIndicadores6GW();
  const navigate = useNavigate();

  const {
    data: tooltips = {},
    isLoading: loadingTooltips,
    error: errorTooltips
  } = useTooltips();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const closeModal = () => { setIsModalOpen(false); setModalTitle(''); setModalContent(''); };

  const heroSubtitle = cleanSubtitle(LABEL_MAP.total_proyectos_bd075.label);

  const normalized = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => ({
      original: d.indicador,
      key: canonicalKey(d.indicador),
      mw: Number(d.capacidad_mw ?? 0),
    }))
    // ⛔️ Filtra las 3 tarjetas no deseadas (ya canonicalizado)
    .filter(item => !EXCLUDE_KEYS.has(item.key));
  }, [data]);

  // Total arriba
  const totalMW = useMemo(() => {
    if (!normalized.length) return 0;
    const total = normalized.find((x) => x.key === 'CAPACIDAD TOTAL')?.mw;
    if (total != null && !Number.isNaN(total)) return total;
    return normalized
      .filter((x) => x.key !== 'CAPACIDAD TOTAL')
      .reduce((acc, x) => acc + (x.mw || 0), 0);
  }, [normalized]);

  const updated = useMemo(() => new Date().toLocaleDateString('es-CO'), []);

  const cards = useMemo(() => {
    if (!normalized.length) return [];

    // tarjetas desde API (excluye “Capacidad Total”—y ya excluimos las 3 no deseadas arriba)
    const apiCards = normalized
      .filter((x) => x.key !== 'CAPACIDAD TOTAL')
      .map((x) => {
        const meta = LABEL_MAP[x.key];
        const tooltipId = TOOLTIP_IDENTIFIERS_MAP[x.key];
        return {
          order: ORDER.indexOf(x.key) === -1 ? 999 : ORDER.indexOf(x.key),
          icon: meta?.icon ?? GWOff,
          label: meta?.label ?? x.original,
          value: x.mw,
          special: meta?.special || false,
          tooltipId,
          key: x.key,
        };
      })
      .sort((a, b) => (a.order - b.order) || a.label.localeCompare(b.label, 'es'));

    // tarjeta fija ZNI
    const zniCard = {
      order: ORDER.indexOf('ZNI'),
      icon: TerritorioOn,
      label: 'Zonas no interconectadas (ZNI)',
      value: 13.89,
      special: true,
      fixedDate: '8/5/2025',
      key: 'ZNI',
    };

    return [...apiCards, zniCard].sort((a, b) => a.order - b.order);
  }, [normalized]);

  const handleHelpClick = (cardKey) => {
    const tooltipId = TOOLTIP_IDENTIFIERS_MAP[cardKey];
    const title = LABEL_MAP[cardKey]?.label || cardKey;
    const content = tooltips[tooltipId];

    if (tooltipId && tooltips[tooltipId]) {
      setModalTitle(cleanSubtitle(title));
      setModalContent(content);
      setIsModalOpen(true);
    } else {
      setModalTitle('Información no disponible');
      setModalContent('No hay información de ayuda disponible para este indicador.');
      setIsModalOpen(true);
    }
  };

  if (loading || loadingTooltips) {
    return (
      <div className="px-4 py-6 text-text-primary">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-secondary rounded w-1/2 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="h-6 bg-surface-secondary rounded mb-4" />
                <div className="h-8 bg-[color:var(--surface-overlay)] rounded mb-2" />
                <div className="h-3 bg-surface-secondary rounded w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || errorTooltips) {
    return <div className="text-red-400 p-6">Error al cargar datos: {error || errorTooltips}</div>;
  }

  return (
    <>
      {/* Encabezado total */}
      <div className="px-4 pt-6">
        <Card className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-5">
          <div className="flex items-center gap-4">
            <span
              className="inline-flex items-center justify-center rounded-full"
              style={{ width: 64, height: 64, background: tokens.colors.accent.primary }}
            >
              <img src={EnergiaAmarillo} alt="Energía" className="w-12 h-12 md:w-14 md:h-14" />
            </span>
            <div className="flex flex-col leading-tight text-left">
              <span className="text-[color:var(--accent-primary)] text-3xl lg:text-5xl font-semibold">
                {formatMW(totalMW)} MW
              </span>
              <span className="mt-1 text-text-secondary text-base lg:text-lg">
                {heroSubtitle}
              </span>
            </div>
          </div>
        <button
          onClick={() => navigate('/proyectos_generacion')}
          className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-2 rounded hover:bg-yellow-500 transition-colors w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          aria-label="Ver seguimiento de proyectos"
        >
          <Bolt size={16} />
          Ver seguimiento de proyectos
        </button>
        </Card>
      </div>

      {/* Tarjetas */}
      <div className="px-2">
        <h2 className="text-2xl text-text-primary font-semibold mb-4">Índices Plan 6GW Plus</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const updatedLabel = card.fixedDate || updated;
            return (
              <Card key={i} className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <img src={card.icon} alt={card.label} className="w-6 h-6 flex-shrink-0" />
                  <span className="text-[18px] font-medium leading-[26px] text-text-secondary">
                    {card.label}
                  </span>
                </div>
                <div className="flex items-center text-text-primary text-3xl font-bold">
                  {formatMW(card.value)} MW
                  <HelpCircle
                    className="text-text-primary cursor-pointer hover:text-text-secondary transition-colors bg-surface-secondary self-center rounded h-6 w-6 p-1 ml-4"
                    title="Ayuda"
                    onClick={() => handleHelpClick(card.key)}
                  />
                </div>
                <div className="text-xs text-text-muted mt-1">Actualizado el: {updatedLabel}</div>
              </Card>
            );
          })}
        </div>
      </div>

      <TooltipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalContent}
      />
    </>
  );
}
