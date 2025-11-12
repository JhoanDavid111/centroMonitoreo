// src/lib/chart-colors.js
// Paleta centralizada de colores para gráficas
// Consolidada desde: ResumenCharts.jsx, CapacidadInstalada.jsx, GeneracionDespacho.jsx

/**
 * Normaliza texto: convierte a mayúsculas y elimina tildes
 * @param {string} s - Texto a normalizar
 * @returns {string} - Texto normalizado
 */
const normalize = (s = '') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

// ────────────────────────────────────────────────
// Paleta de colores por tecnología
// ────────────────────────────────────────────────
export const TECHNOLOGY_COLORS = {
  // Energías renovables
  SOLAR: '#FFC800',
  'SOLAR FV': '#FFC800',
  'RAD SOLAR': '#FFC800',
  
  EOLICA: '#5DFF97',
  EÓLICA: '#5DFF97',
  EOLICO: '#5DFF97',
  VIENTO: '#5DFF97',
  
  PCH: '#3B82F6',
  HIDRAULICA: '#3B82F6',
  HIDRÁULICA: '#3B82F6',
  
  // Térmicas
  TERMICA: '#F97316',
  TÉRMICA: '#F97316',
  
  COGENERADOR: '#D1D1D0',
  
  // Biomasa
  BIOMASA: '#B39FFF',
  'BIOMASA Y RESIDUOS': '#B39FFF',
  
  // Default
  DEFAULT: '#666666'
};

// ────────────────────────────────────────────────
// Paleta de colores por categoría de proyecto
// ────────────────────────────────────────────────
export const CATEGORY_COLORS = {
  'AGGE': '#0991B5',
  'AGPE': '#00FBFA',
  'Generacion Centralizada': '#B8F600',
  'Generacion Distribuida': '#FDBA74',
  DEFAULT: '#666666'
};

// ────────────────────────────────────────────────
// Funciones helper para obtener colores
// ────────────────────────────────────────────────

/**
 * Obtiene el color para una tecnología dada
 * Realiza búsqueda exacta y luego parcial para mayor robustez
 * 
 * @param {string} name - Nombre de la tecnología
 * @returns {string} - Color hexadecimal
 */
export const getColorForTechnology = (name = '') => {
  if (!name) return TECHNOLOGY_COLORS.DEFAULT;
  
  const normalized = normalize(name);
  
  // Buscar coincidencias exactas primero
  if (TECHNOLOGY_COLORS[normalized]) {
    return TECHNOLOGY_COLORS[normalized];
  }
  
  // Búsqueda parcial para mayor robustez
  if (normalized.includes('SOLAR')) return TECHNOLOGY_COLORS.SOLAR;
  if (normalized.includes('EOLIC') || normalized.includes('VIENTO')) return TECHNOLOGY_COLORS.EOLICA;
  if (normalized === 'PCH') return TECHNOLOGY_COLORS.PCH;
  if (normalized.includes('HIDRAULIC')) return TECHNOLOGY_COLORS.HIDRAULICA;
  if (normalized.includes('TERM')) return TECHNOLOGY_COLORS.TERMICA;
  if (normalized.includes('COGENER')) return TECHNOLOGY_COLORS.COGENERADOR;
  if (normalized.includes('BIOMASA')) return TECHNOLOGY_COLORS.BIOMASA;
  
  return TECHNOLOGY_COLORS.DEFAULT;
};

/**
 * Obtiene el color para una categoría de proyecto dada
 * 
 * @param {string} name - Nombre de la categoría
 * @returns {string} - Color hexadecimal
 */
export const getColorForCategory = (name = '') => {
  if (!name) return CATEGORY_COLORS.DEFAULT;
  return CATEGORY_COLORS[name] || CATEGORY_COLORS.DEFAULT;
};

