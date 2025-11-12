// src/lib/chart-tooltips.js
// Formatters reutilizables para tooltips de gráficas Highcharts

import Highcharts from './highcharts-config';
import tokens from '../styles/theme.js';

/**
 * Helper para formatear números
 * @param {number} v - Valor a formatear
 * @param {number} dec - Decimales (por defecto: 2)
 * @returns {string} - Valor formateado
 */
export const fmt = (v, dec = 2) => Highcharts.numberFormat(v, dec, ',', '.');

/**
 * Formatter para gráficas de pie (un solo punto)
 * Muestra: nombre, valor y porcentaje
 */
export function singlePieTooltipFormatter() {
  const p = this.point;
  const percent =
    typeof p.percentage === 'number'
      ? p.percentage
      : (p.y / this.series.data.reduce((s, d) => s + d.y, 0)) * 100;
  
  return `
    <div style="padding: ${tokens.spacing.xs} 0;">
      <span style="font-size:${tokens.font.size.base}; color:${tokens.colors.text.primary};"><span style="color:${p.color}; font-size:16px;">● </span><b>${p.name}</b></span><br/>
      Capacidad: <b>${fmt(p.y, 2)} MW</b><br/>
      (${fmt(percent, 2)}%)
    </div>
  `;
}

/**
 * Formatter para gráficas de columnas apiladas
 * Muestra todas las series del punto X con total
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.unit - Unidad de medida (por defecto: 'MW')
 * @param {boolean} options.showTotal - Mostrar total (por defecto: true)
 */
export function stackedColumnTooltipFormatter(options = {}) {
  const { unit = 'MW', showTotal = true } = options;
  
  // Retornar una función que será llamada por Highcharts con el contexto correcto
  return function() {
    const pts = (this.points || []).filter((p) => p.series.type !== 'scatter');
    const total = pts.reduce((s, p) => s + p.y, 0);
    
    const rows = pts
      .map(
        (p) => `
      <tr>
        <td style="padding:${tokens.spacing.xs} ${tokens.spacing.sm} ${tokens.spacing.xs} 0; white-space:nowrap; color:${tokens.colors.text.secondary};"><span style="color:${p.color}; font-size:16px;">● </span>${p.series.name}:</td>
        <td style="text-align:right; padding:${tokens.spacing.xs} 0; color:${tokens.colors.text.primary};"><b>${fmt(p.y, 2)} ${unit}</b></td>
      </tr>
    `
      )
      .join('');
    
    const totalRow = showTotal ? `
    <tr>
      <td colspan="2" style="border-top:1px solid ${tokens.colors.border.default}; padding-top:${tokens.spacing.sm}; padding-bottom:${tokens.spacing.xs}; color:${tokens.colors.text.primary};">Total: <b>${fmt(total, 2)} ${unit}</b></td>
    </tr>
  ` : '';
    
    return `
    <div style="padding: ${tokens.spacing.xs} 0;">
      <span style="font-size:${tokens.font.size.md}; font-weight:${tokens.font.weight.semibold}; color:${tokens.colors.text.primary};">${this.x}</span>
      <table style="margin-top: 4px;">${rows}${totalRow}</table>
    </div>
  `;
  };
}

/**
 * Formatter para gráficas de área apilada
 * Muestra todas las series con fecha y total
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.unit - Unidad de medida (por defecto: 'MW')
 * @param {string} options.dateFormat - Formato de fecha (por defecto: '%e %b %Y')
 * @param {boolean} options.showTotal - Mostrar total (por defecto: true)
 */
export function stackedAreaTooltipFormatter(options = {}) {
  const { unit = 'MW', dateFormat = '%e %b %Y', showTotal = true } = options;
  
  // Retornar una función que será llamada por Highcharts con el contexto correcto
  return function() {
    const pts = this.points || [];
    const total = pts.reduce((s, pt) => s + pt.y, 0);
    
    let header = '';
    if (dateFormat) {
      header = `<b>Fecha: ${Highcharts.dateFormat(dateFormat, this.x)}</b><br/><br/>`;
    } else {
      header = `<b>${this.x}</b><br/><br/>`;
    }
    
    let rows = pts
      .map((pt) => `
        <span style="color:${pt.color}; font-size:16px;">● </span>
        ${pt.series.name}: <b>${fmt(pt.y, 2)} ${unit}</b><br/><br/>
      `)
      .join('');
    
    const totalRow = showTotal ? `
      <span style="border-top:1px solid ${tokens.colors.border.default}; padding-top:${tokens.spacing.sm}; padding-bottom:${tokens.spacing.xs}; display:block; width: 100%; color:${tokens.colors.text.primary};">
        <b>Total: ${fmt(total, 2)} ${unit}</b>
      </span>
    ` : '';
    
    return `<div style="padding: ${tokens.spacing.xs} 0; color:${tokens.colors.text.secondary};">${header}${rows}${totalRow}</div>`;
  };
}

/**
 * Formatter para gráficas de área apilada (formato tabla)
 * Similar a stackedAreaTooltipFormatter pero con formato de tabla
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.unit - Unidad de medida (por defecto: 'MW/h')
 * @param {string} options.headerFormat - Formato del encabezado (por defecto: 'Hora: {x}')
 */
export function areaTooltipFormatter(options = {}) {
  const { unit = 'MW/h', headerFormat = 'Hora: {x}' } = options;
  
  // Retornar una función que será llamada por Highcharts con el contexto correcto
  return function() {
    const pts = this.points || [];
    const total = pts.reduce((s, p) => s + p.y, 0);
    
    const rows = pts
      .map(
        (p) => `
      <tr>
        <td style="padding:6px 8px 6px 0; white-space:nowrap;">
          <span style="color:${p.series.color}; font-size:16px;">● </span> ${p.series.name}:
        </td>
        <td style="text-align:right; padding:6px 0;"><b>${fmt(p.y, 2)} ${unit}</b></td>
      </tr>
    `
      )
      .join('');
    
    const header = headerFormat.replace('{x}', this.x);
    
    return `
    <div style="padding: ${tokens.spacing.xs} 0;">
      <span style="font-size:${tokens.font.size.md}; font-weight:${tokens.font.weight.semibold}; color:${tokens.colors.text.primary};">${header}</span>
      <table style="margin-top: 4px;">${rows}
        <tr>
          <td colspan="2" style="border-top:1px solid ${tokens.colors.border.default}; padding-top:${tokens.spacing.sm}; padding-bottom:${tokens.spacing.xs}; color:${tokens.colors.text.primary};">
            Total: <b style="font-size: ${tokens.font.size.base};">${fmt(total, 2)} ${unit}</b>
          </td>
        </tr>
      </table>
    </div>
  `;
  };
}

/**
 * Formatter genérico para múltiples series
 * Útil para gráficas con múltiples series sin apilado
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.unit - Unidad de medida (opcional)
 * @param {string} options.dateFormat - Formato de fecha si es tipo datetime (opcional)
 */
export function multiSeriesTooltipFormatter(options = {}) {
  const { unit = '', dateFormat } = options;
  
  // Retornar una función que será llamada por Highcharts con el contexto correcto
  return function() {
    const header = dateFormat 
      ? Highcharts.dateFormat(dateFormat, this.x) 
      : this.x;
    
    const rows = (this.points || [])
      .map((p) => `
      <div style="margin:5px 0; color:${tokens.colors.text.secondary};">
        <span style="color:${p.color}; font-size:16px;">● </span>
        ${p.series.name}: <b style="color:${tokens.colors.text.primary};">${fmt(p.y, 2)}${unit ? ' ' + unit : ''}</b>
      </div>
    `)
      .join('');
    
    return `<div style="padding: ${tokens.spacing.xs} 0;"><b style="font-size:${tokens.font.size.md}; color:${tokens.colors.text.primary};">${header}</b><br/>${rows}</div>`;
  };
}

