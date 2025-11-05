// src/utils/textUtils.js
// Utilidades centralizadas para normalización y procesamiento de texto

/**
 * Elimina acentos y diacríticos de un string
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto sin acentos
 */
export function stripAccents(text = '') {
  return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normaliza un string para comparación (sin acentos, mayúsculas, sin espacios extra)
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export function normalizeText(text = '') {
  return stripAccents(String(text).trim()).toUpperCase();
}

/**
 * Función helper para normalización rápida (alias de normalizeText)
 * Útil para comparaciones en componentes
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export function norm(text = '') {
  return normalizeText(text);
}



