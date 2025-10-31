// src/lib/chart-tooltips.js
// Formatters reutilizables para tooltips de gráficas Highcharts

import Highcharts from './highcharts-config';

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
    <span style="font-size:13px">
      <span style="color:${p.color}; fontSize:20px;">● </span>
      <b>${p.name}</b>
    </span><br/>
    Capacidad: <b>${fmt(p.y, 2)} MW</b><br/>
    (${fmt(percent, 2)}%)
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
        <td style="padding:4px 8px 4px 0; white-space:nowrap;">
          <span style="color:${p.color}; fontSize:20px;">● </span>${p.series.name}:
        </td>
        <td style="text-align:right;"><b>${fmt(p.y, 2)} ${unit}</b></td>
      </tr>
    `
      )
      .join('');
    
    const totalRow = showTotal ? `
    <tr>
      <td colspan="2" style="border-top:1px solid #555; padding-top:8px">
        Total: <b style="fontSize: 13px;">${fmt(total, 2)} ${unit}</b>
      </td>
    </tr>
  ` : '';
    
    return `
    <span style="font-size:13px"><b>${this.x}</b></span>
    <table>${rows}${totalRow}</table>
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
        <span style="color:${pt.color}; fontSize:20px;">● </span>
        ${pt.series.name}: <b>${fmt(pt.y, 2)} ${unit}</b><br/>
      `)
      .join('');
    
    const totalRow = showTotal ? `
      <span style="border-top:1px solid #555; padding-top:8px; display:block; margin-top:8px;">
        <b>Total: ${fmt(total, 2)} ${unit}</b>
      </span>
    ` : '';
    
    return `${header}${rows}${totalRow}`;
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
        <td style="padding:4px 8px 4px 0; white-space:nowrap;">
          <span style="color:${p.series.color}; fontSize:20px;">● </span> ${p.series.name}:
        </td>
        <td style="text-align:right;"><b>${fmt(p.y, 2)} ${unit}</b></td>
      </tr>
    `
      )
      .join('');
    
    const header = headerFormat.replace('{x}', this.x);
    
    return `
    <span style="font-size:12px"><b>${header}</b></span>
    <table>${rows}
      <tr>
        <td colspan="2" style="border-top:1px solid #555;padding-top:8px">
          Total: <b style="fontSize: 13px;">${fmt(total, 2)} ${unit}</b>
        </td>
      </tr>
    </table>
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
      <div style="margin:5px 0;">
        <span style="color:${p.color}; fontSize:20px;">● </span>
        ${p.series.name}: <b>${fmt(p.y, 2)}${unit ? ' ' + unit : ''}</b>
      </div>
    `)
      .join('');
    
    return `<div style="padding:5px;"><b>${header}</b><br/>${rows}</div>`;
  };
}

