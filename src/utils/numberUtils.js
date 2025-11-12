// src/utils/numberUtils.js
// Utilidades centralizadas para formateo de números

/**
 * Formateador de números para valores enteros (sin decimales)
 */
export const formatInteger = new Intl.NumberFormat('es-CO', { 
  maximumFractionDigits: 0 
});

/**
 * Formateador de números para valores con 2 decimales
 */
export const formatDecimal = new Intl.NumberFormat('es-CO', { 
  minimumFractionDigits: 0, 
  maximumFractionDigits: 2 
});

/**
 * Formatea un valor numérico como entero
 * @param {number|null|undefined} value - Valor a formatear
 * @returns {string} Valor formateado
 */
export function formatInt(value) {
  return formatInteger.format(value ?? 0);
}

/**
 * Formatea un valor numérico con decimales
 * @param {number|null|undefined} value - Valor a formatear
 * @param {number} minDecimals - Decimales mínimos (default: 0)
 * @param {number} maxDecimals - Decimales máximos (default: 2)
 * @returns {string} Valor formateado
 */
export function formatNumber(value, minDecimals = 0, maxDecimals = 2) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals
  }).format(value ?? 0);
}

/**
 * Formatea un valor en MW (megavatios)
 * @param {number|null|undefined} mw - Valor en MW
 * @returns {string} Valor formateado con 2 decimales
 */
export function formatMW(mw) {
  return formatNumber(mw, 2, 2);
}

/**
 * Formatea un valor en MW sin decimales
 * @param {number|null|undefined} mw - Valor en MW
 * @returns {string} Valor formateado sin decimales
 */
export function formatMWInt(mw) {
  return formatInt(mw);
}

/**
 * Formatea un valor usando Highcharts.numberFormat
 * Útil para formatters dentro de opciones de Highcharts
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Número de decimales
 * @param {string} decimalSep - Separador decimal (default: ',')
 * @param {string} thousandsSep - Separador de miles (default: '.')
 * @returns {string} Valor formateado
 */
export function formatHighcharts(value, decimals = 0, decimalSep = ',', thousandsSep = '.') {
  // Esta función se usa típicamente dentro de formatters de Highcharts
  // donde Highcharts.numberFormat está disponible
  // Retornamos una función que puede ser llamada cuando Highcharts esté disponible
  if (typeof window !== 'undefined' && window.Highcharts) {
    return window.Highcharts.numberFormat(value, decimals, decimalSep, thousandsSep);
  }
  // Fallback si Highcharts no está disponible
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
    useGrouping: true
  }).format(value ?? 0);
}

