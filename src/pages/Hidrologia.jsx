import {
  Banner,
  BannerBackground,
  BannerHeader,
  BannerTitle,
  BannerLogo,
  BannerAction,
} from '../components/ui/Banner';

// src/pages/Hidrologia.jsx
import React, { useMemo, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useReactToPrint } from 'react-to-print';

// HTML embebidos
import chart1Html from '../data/Chart1.html?raw';
import chart2Html from '../data/Chart2.html?raw';
import chart3Html from '../data/Chart3.html?raw'; // Información general
import tablaHidrologiaCompleta from '../data/tabla_hidrologia-completa.html?raw'; // Aportes hídricos
import bannerHidrologia from '../assets/bannerHidrologia.png';
import hidrologiaIcon from '../assets/svg-icons/Hidrologia-On.svg';
import OfertaDemandaIcon from '../assets/svg-icons/OfertaDemanda-On.svg';
import AutogeneracionIcon from '../assets/svg-icons/Autogeneracion-On.svg';
import GeneracionTermicaIcon from '../assets/svg-icons/GeneracionTermica-On.svg';
import arrowUpDarkmodeAmarilloIcon from '../assets/svg-icons/arrowUpDarkmodeAmarillo.svg';
import arrowsDarkmodeAmarilloIcon from '../assets/svg-icons/arrowsDarkmodeAmarillo.svg';

import MapaHidrologia from '../components/MapaHidrologia';

// ===== Paleta =====
const COLORS = {
  down: '#EF4444',
  up: '#22C55E',
  blue: '#3B82F6',
  gray: '#D1D1D0',
  yellow: '#FFC800',
  chipText: '#111827',
  darkBg: '#262626',
  darkBg2: '#1f1f1f',
  border: '#3a3a3a',
};

/* ==================== helpers ==================== */
const extractCategories = (html) => {
  const m = html.match(/xAxis:\s*\{\s*categories:\s*\[([\s\S]*?)\]\s*,/);
  if (!m) return [];
  return [...m[1].matchAll(/'([^']+)'/g)].map(mm => mm[1]);
};

const extractAllNumericSeries = (html) => {
  const sIdx = html.indexOf('series:');
  const tail = sIdx !== -1 ? html.slice(sIdx) : html;
  const re = /\{name:\s*'([^']+)'\s*,\s*data:\s*\[([\s\S]*?)\]/g;
  const out = [];
  let m;
  while ((m = re.exec(tail))) {
    const name = m[1];
    const nums = m[2]
      .split(',')
      .map(v => parseFloat(v))
      .filter(v => !Number.isNaN(v));
    out.push({ name, data: nums });
  }
  return out;
};

const extractUtcPairs = (src) => {
  const out = [];
  // Soporta espacios, coma decimal y valores negativos
  const re = /\bDate\.UTC\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*[,]?\s*([\-\d.,]+)/g;
  let mm;
  while ((mm = re.exec(src))) {
    const y = +mm[1], m = +mm[2], d = +mm[3];
    const val = parseFloat(String(mm[4]).replace(',', '.'));
    if (
      Number.isFinite(val) &&
      y >= 1971 && y <= 2025 &&
      m >= 0 && m <= 11 &&
      d >= 1 && d <= 31
    ) {
      out.push([Date.UTC(y, m, d), val]);
    }
    }
    return out;
};

const extractSeriesByNameUTC = (html, seriesName) => {
  const idx = html.indexOf(`name: '${seriesName}'`);
  if (idx === -1) return [];
  const nextIdx = html.indexOf("name: '", idx + 6);
  const endIdx = nextIdx !== -1 ? nextIdx : html.indexOf('}]', idx);
  const block = html.slice(idx, endIdx);
  return extractUtcPairs(block);
};

const extractAllSeriesUTCGeneric = (html) => {
  const out = [];
  // Captura cada bloque de serie con name y data (comillas simples o dobles)
  const re = /\{\s*name\s*:\s*['"]([^'"]+)['"][\s\S]*?data\s*:\s*\[([\s\S]*?)\][\s\S]*?\}/g;
  let m;
  while ((m = re.exec(html))) {
    const name = m[1];
    const dataBlock = m[2];
    const utc = extractUtcPairs(dataBlock); // pares [Date.UTC, y]
    // fallback numérico por si una serie viniera sin UTC
    const num = dataBlock
      .split(',')
      .map(s => parseFloat(String(s).replace(',', '.')))
      .filter(v => Number.isFinite(v));
    out.push({ name, utc, num });
  }
  return out;
};

// ===== Tiempo / ticks mensuales =====
const MS_DAY = 24 * 3600 * 1000;
function monthStart(ts) {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
}
function addMonths(ts, n = 1) {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1);
}
function buildMonthlyTicks(minX, maxX) {
  if (!Number.isFinite(minX) || !Number.isFinite(maxX) || minX >= maxX) return undefined;
  const ticks = [];
  let t = monthStart(minX);
  while (t <= maxX) {
    ticks.push(t);
    t = addMonths(t, 1);
  }
  return ticks;
}

// Ya lo tienes, lo usamos también:
function normalizeXY(arr) {
  if (!Array.isArray(arr)) return [];
  const cleaned = arr
    .filter(p => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]))
    .map(([x, y]) => [Number(x), Number(y)])
    .sort((a, b) => a[0] - b[0]);

  const dedup = [];
  for (let i = 0; i < cleaned.length; i++) {
    if (i === 0 || cleaned[i][0] !== cleaned[i - 1][0]) dedup.push(cleaned[i]);
    else dedup[dedup.length - 1] = cleaned[i];
  }
  return dedup;
}

// Filtra puntos “basura” en la época Unix y cualquier y no finito
const EPOCH_FLOOR = Date.UTC(1971, 0, 1);
function sanitizeSeries(pts) {
  return normalizeXY(pts).filter(([x, y]) =>
    Number.isFinite(x) && Number.isFinite(y) && x >= EPOCH_FLOOR && x <= HARD_MAX_JUL2025
  );
}

// Límite duro hasta 2025-07-31 (mes 6 porque Date.UTC es 0-based)
const HARD_MAX_JUL2025 = Date.UTC(2025, 6, 31);

function clipToMax(pts, maxX = HARD_MAX_JUL2025) {
  return (pts || []).filter(
    (p) => Array.isArray(p) && Number.isFinite(p[0]) && p[0] <= maxX
  );
}

// (solo para el fallback con categorías tipo "YYYY-MM")
function ymToUtc(ym) {
  const m = String(ym).match(/^(\d{4})[-/](\d{1,2})/);
  if (!m) return NaN;
  return Date.UTC(+m[1], (+m[2]) - 1, 1);
}


// Tooltip SOLO para el slice/punto en pies (primeros 2 charts)
function singlePieTooltipFormatter() {
  return `
      <div style="pointer-events:auto;user-select:text;padding:6px;">
        <b>${this.series.name}</b><br/>
        ${this.x}: ${this.y}
      </div>
    `;
}

/* ======================= Índices (mock visual) ======================= */
const indices = [
  {
    title: 'Nivel de embalse actual',
    updated: '24/7/2025',
    value: '13.907,22 GWh-día',
    deltaText: '−23,31 GWh',
    deltaDir: 'down',
    pct: '80.89%',
    pctDeltaText: '−0,14%',
    pctDeltaDir: 'down',
  },
  {
    title: 'Aportes mensuales promedio',
    updated: 'Julio 2025',
    value: '311.55 GWh-día',
    deltaText: '−23,31 GWh',
    deltaDir: 'down',
    pct: '122.42%',
    pctDeltaText: '−0,14%',
    pctDeltaDir: 'down',
    sub: 'Media histórica: 254.48 GWh-día'
  },
  {
    title: 'Generación promedio diaria',
    updated: 'Julio vs junio 2025',
    groups: [
      { name: 'Hídrica', value: '195.49', unit: 'GWh-día', delta: '+7.2 GWh (+3.6%)', dir: 'up' },
      { name: 'Térmica', value: '24.37', unit: 'GWh-día', delta: '−0.7 GWh (−2.6%)', dir: 'down' },
      { name: 'FNCER', value: '15.03', unit: 'GWh-día', delta: '+1.2 GWh (+8.9%)', dir: 'up' },
    ],
    bottom: 'Demanda real promedio: 234.90 GWh – día',
    bottomDelta: '+7.7 GWh (+3.3%)',
    bottomDir: 'up',
  },
  {
    title: 'Precios de Energía – Julio vs junio 2025',
    updated: 'Promedios mensuales diarios (COP/kWh)',
    groups: [
      { name: 'Mínimo\nDiario', value: '102.96', unit: 'COP/kWh', delta: '−3.82 (−3.7%)', dir: 'down' },
      { name: 'Promedio\nDiario', value: '125.75', unit: 'COP/kWh', delta: '+13.77 (+10.9%)', dir: 'up' },
      { name: 'Máximo\nDiario', value: '352.33', unit: 'COP/kWh', delta: '+170.34 (+48.3%)', dir: 'up' },
    ],
    badge: 'Precio marginal de escasez',
    badgeValue: '865.22 COP/kWh'
  },
];

function TrendChip({ dir = 'up', children }) {
  const isUp = dir === 'up';
  const bg = isUp ? '#22C55E' : '#EF4444';
  return (
    <span
      className="
        inline-flex items-center gap-2 px-3 py-1
        rounded-full text-sm font-semibold
        whitespace-nowrap leading-none
      "
      style={{
        backgroundColor: bg,
        color: '#fff',
        border: '1px solid rgba(0,0,0,.15)',
      }}
    >
      <span aria-hidden className="text-base leading-none">{isUp ? '↑' : '↓'}</span>
      <span className="leading-none" style={{ color: '#fff' }}>{children}</span>
    </span>
  );
}

/* =================== Highcharts (desde HTML) =================== */
function useAportesOptionsFromHtml() {
  const aportes = useMemo(() => {
    const s1 = extractSeriesByNameUTC(chart2Html, 'Aportes (GWh-dia)');
    const s2 = extractSeriesByNameUTC(chart2Html, 'Aportes Media Histórica (GWh-dia)');
    const s3 = extractSeriesByNameUTC(chart2Html, 'Nivel de Embalse Util (%)');
    return { s1, s2, s3 };
  }, []);

  return useMemo(() => ({
    chart: {
      backgroundColor: COLORS.darkBg,
      height: 650,
      marginTop: 80,
      marginBottom: 180,
      spacingBottom: 40,
      type: 'column'
    },
    title: { 
      text: 'Aportes y nivel útil de embalses por mes', 
      align: 'left', 
      style: { color: '#fff', fontSize: '1.65em' } 
    },
    subtitle: { text: '', align: 'left', style: { color: COLORS.gray } },
    xAxis: {
      type: 'datetime',
      gridLineWidth: 1,
      gridLineColor: '#444',
      tickPixelInterval: 130,
      labels: {
        rotation: -45,
        align: 'right',
        autoRotation: undefined,
        formatter() { return Highcharts.dateFormat('%Y-%m', this.value); },
        style: { color: COLORS.gray, fontSize: '12px' }
      }
    },
    yAxis: [
      { title: { text: 'Aportes (GWh-día)', style: { color: COLORS.gray } }, labels: { style: { color: COLORS.gray } } },
      { title: { text: 'Nivel (%)', style: { color: COLORS.gray } }, labels: { style: { color: COLORS.gray } }, opposite: true }
    ],
    legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', y: 20, itemStyle: { color: '#fff', fontSize: '16px' } },
    series: [
      { name: 'Aportes (GWh-dia)', type: 'line', color: '#05d80a', marker: { radius: 3 }, lineWidth: 2, data: aportes.s1, tooltip: { valueSuffix: ' GWh-dia' } },
      { name: 'Aportes Media Histórica (GWh-dia)', type: 'line', color: COLORS.yellow, dashStyle: 'Dash', marker: { radius: 3 }, lineWidth: 2, data: aportes.s2, tooltip: { valueSuffix: ' GWh-dia' } },
      { name: 'Nivel de Embalse Util (%)', type: 'area', yAxis: 1, color: COLORS.blue, fillOpacity: 0.3, lineWidth: 1, data: aportes.s3, tooltip: { valueSuffix: '%' } },
    ],
    tooltip: { 
      backgroundColor: 'rgba(0,0,0,.50)',
      style: { color: '#FFF', fontSize: '12px' },
      xDateFormat: '%Y-%m',
      shared: true,
      useHTML: true,
      formatter: function () {
        let header = `<b>${Highcharts.dateFormat("%e %b %Y", this.x)}</b><br/>`;
        let rows = this.points
          .map((point) => {
            const suffix =
              (point.series.options.tooltip &&
                point.series.options.tooltip.valueSuffix) || "";
            return `
              <div style="user-select:text;pointer-events:auto;margin:2px 0;">
                <span style="color:${point.color}">●</span>
                ${point.series.name}: <b>${Highcharts.numberFormat(point.y, 2)}${suffix}</b>
              </div>
            `;
          })
          .join("");
        return `<div style="padding:6px;">${header}${rows}</div>`;
      },
    },
  }), [aportes]);
}

function useDesabastecimientoOptionsFromHtml() {
  const LABEL_STEP = 2;
  const LABEL_STEP_MONTHS = 2;
  const PX_PER_LABEL = 80;



  const parsed = useMemo(() => {
    const seriesBlocks = extractAllSeriesUTCGeneric(chart1Html);
    const hasUTC = seriesBlocks.some(s => s.utc && s.utc.length > 0);
    const categories = hasUTC ? null : extractCategories(chart1Html);
    return { seriesBlocks, hasUTC, categories };
  }, []);

  return useMemo(() => {
    // ===== Camino ideal: datetime con pares UTC =====
    if (parsed.hasUTC) {
      const by = (regex, idxFallback) =>
        parsed.seriesBlocks.find(s => regex.test(s.name))?.utc ??
        parsed.seriesBlocks[idxFallback]?.utc ?? [];

      // Normaliza + filtra basura y recorta hasta 2025-07-31
      const p1 = clipToMax(sanitizeSeries(by(/bolsa.*punta|bolsa/i, 0)));
      const p2 = clipToMax(sanitizeSeries(by(/escasez/i, 1)));
      const p3 = clipToMax(sanitizeSeries(by(/embalse/i, 2)));
      const p4 = clipToMax(sanitizeSeries(by(/senda|referencia/i, 3)));

      const allX = [...p1, ...p2, ...p3, ...p4]
        .filter(p => Array.isArray(p) && Number.isFinite(p[0]))
        .map(pt => pt[0])
        .filter(x => x >= EPOCH_FLOOR && x <= HARD_MAX_JUL2025);

      const minX = allX.length ? Math.min(...allX) : undefined;

      return {
        chart: {
          zooming: { type: 'x' },
          backgroundColor: COLORS.darkBg,
          height: 600,
          marginTop: 50,
          marginBottom: 140,
          spacingBottom: 20,
        },
        title: {
          text: 'Estatuto de desabastecimiento',
          align: 'left',
          margin: 50,
          style: { color: '#fff', fontSize: '1.65em' },
        },

xAxis: {
  type: 'datetime',
  min: Number.isFinite(minX) ? minX : undefined,
  max: HARD_MAX_JUL2025,
  ordinal: false,
  startOnTick: false,
  endOnTick: false,
  minPadding: 0,
  maxPadding: 0,

  // Ticks mensuales con salto dinámico según ancho del eje
  tickPositioner: function () {
    const { dataMin, dataMax } = this.getExtremes();
    if (!Number.isFinite(dataMin) || !Number.isFinite(dataMax) || dataMin >= dataMax) {
      return this.tickPositions || [];
    }
    const localMin = Math.max(dataMin, EPOCH_FLOOR);
    const localMax = Math.min(dataMax, HARD_MAX_JUL2025);

    // primer día de mes en min y max
    const s = new Date(localMin);
    const e = new Date(localMax);
    let t = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), 1);
    const end = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), 1);

    // meses totales en el rango
    const months =
      (e.getUTCFullYear() - s.getUTCFullYear()) * 12 +
      (e.getUTCMonth() - s.getUTCMonth()) + 1;

    // paso dinámico en meses ≈ (N etiquetas) = len / PX_PER_LABEL
    const len = Math.max(1, this.len || 800);
    const step = Math.max(1, Math.ceil((months * PX_PER_LABEL) / len));

    const pos = [];
    let i = 0;
    while (t <= end) {
      if (i % step === 0 && t >= EPOCH_FLOOR) pos.push(t);
      const d = new Date(t);
      t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
      i++;
    }
    return pos;
  },

  gridLineWidth: 1,
  gridLineColor: '#444',
  lineColor: '#666',
  tickColor: '#666',
  lineWidth: 1,
  tickLength: 6,

  labels: {
    // ¡Importante! No usar labels.step aquí
    rotation: -45,
    align: 'right',
    autoRotation: undefined,
    style: { color: COLORS.gray, fontSize: '12px' },
    formatter() {
      if (this.value < EPOCH_FLOOR) return ''; // nunca 1970
      return Highcharts.dateFormat('%Y-%m', this.value);
    },
  },
  title: { text: 'Fecha', style: { color: COLORS.gray, fontSize: '16px' } },
},

        yAxis: [
          { title: { text: 'Precios (COP/kWh)', style: { color: COLORS.gray, fontSize: '16px' } }, labels: { style: { color: COLORS.gray, fontSize: '12px' } } },
          { title: { text: 'Nivel de Embalse Útil (%)', style: { color: COLORS.gray, fontSize: '16px' } }, labels: { format: '{value}%', style: { color: COLORS.gray, fontSize: '12px' } }, opposite: true },
        ],
        legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', y: 20, itemStyle: { color: COLORS.gray, fontSize: '16px' } },
        tooltip: {
          shared: true,
          useHTML: true,
          backgroundColor: 'rgba(0,0,0,.50)',
          style: { color: '#FFF', fontSize: '12px' },
          xDateFormat: '%Y-%m',
        },
        plotOptions: { series: { marker: { enabled: false }, turboThreshold: 0 } },
        series: [
          { name: 'Precio de bolsa en períodos punta (COP/kWh)', type: 'spline',     yAxis: 0, color: '#05d80a',                      data: p1 },
          { name: 'Precio marginal de escasez (COP/kWh)',        type: 'spline',     yAxis: 0, color: COLORS.yellow, dashStyle: 'ShortDash', data: p2 },
          { name: 'Nivel de embalse útil (%)',                   type: 'areaspline', yAxis: 1, color: COLORS.blue,   fillOpacity: 0.2,        data: p3, tooltip: { valueSuffix: '%' } },
          { name: 'Senda de referencia (%)',                     type: 'spline',     yAxis: 1, color: COLORS.down,   dashStyle: 'Dot',        data: p4, tooltip: { valueSuffix: '%' } },
        ],
      };
    }

    // ===== Fallback: categorías (no hay UTC en el HTML) =====
    const b = parsed.seriesBlocks;
    const s0 = b[0]?.num ?? [];
    const s1 = b[1]?.num ?? [];
    const s2 = b[2]?.num ?? [];
    const s3 = b[3]?.num ?? [];
    const cats = parsed.categories ?? [];

    // recorta y filtra 1970 explícitamente
    const catsCut = (parsed.categories ?? []).filter(c => {
      const t = ymToUtc(c);
      return Number.isFinite(t) && t >= EPOCH_FLOOR && t <= HARD_MAX_JUL2025;
    });

    // Ticks cada 2 (o 3) categorías
    const tickIdx = catsCut.map((_, i) => i).filter(i => i % LABEL_STEP_MONTHS === 0);


    const L = catsCut.length;
    const s0cut = s0.slice(0, L);
    const s1cut = s1.slice(0, L);
    const s2cut = s2.slice(0, L);
    const s3cut = s3.slice(0, L);

    return {
      chart: {
        zooming: { type: 'xy' },
        backgroundColor: COLORS.darkBg,
        height: 600,
        marginTop: 50,
        marginBottom: 140,
        spacingBottom: 20,
      },
      title: {
        text: 'Estatuto de desabastecimiento',
        align: 'left',
        margin: 50,
        style: { color: '#fff', fontSize: '1.65em' },
      },
xAxis: {
  categories: catsCut,
  // Calcula tickPositions según el ancho del eje y número de categorías
  tickPositioner: function () {
    const N = catsCut.length;
    if (!N) return [];
    const len = Math.max(1, this.len || 800);
    const step = Math.max(1, Math.ceil((N * PX_PER_LABEL) / len));
    const pos = [];
    for (let i = 0; i < N; i += step) pos.push(i);
    return pos;
  },

  labels: {
    // No uses labels.step ni tickInterval aquí
    rotation: -45,
    align: 'right',
    autoRotation: undefined,
    style: { color: COLORS.gray, fontSize: '12px' },
  },

  gridLineWidth: 1,
  gridLineColor: '#444',
  lineColor: '#666',
  tickColor: '#666',
  lineWidth: 1,
  tickLength: 6,
  title: { text: 'Fecha', style: { color: COLORS.gray, fontSize: '16px' } },
},

      yAxis: [
        { title: { text: 'Precios (COP/kWh)', style: { color: COLORS.gray, fontSize: '16px' } }, labels: { style: { color: COLORS.gray, fontSize: '12px' } } },
        { title: { text: 'Nivel de Embalse Útil (%)', style: { color: COLORS.gray, fontSize: '16px' } }, labels: { format: '{value}%', style: { color: COLORS.gray, fontSize: '12px' } }, opposite: true },
      ],
      legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', y: 20, itemStyle: { color: COLORS.gray, fontSize: '16px' } },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: 'rgba(0,0,0,.50)',
        style: { color: '#FFF', fontSize: '12px' },
        formatter() {
          const idx = this.points?.[0]?.point?.index ?? 0;
          const header = `<b>${(catsCut ?? [])[idx] ?? ''}</b><br/>`;
          const rows = (this.points || [])
            .map(p => `<div style="user-select:text;pointer-events:auto;margin:2px 0;">
              <span style="color:${p.color}">●</span>
              ${p.series.name}: <b>${Highcharts.numberFormat(p.y, 2)}</b>
            </div>`).join('');
          return `<div style="padding:6px;">${header}${rows}</div>`;
        },
      },
      plotOptions: { series: { marker: { enabled: false }, turboThreshold: 0 } },
      series: [
        { name: 'Precio de bolsa en períodos punta (COP/kWh)', type: 'spline',     yAxis: 0, color: '#05d80a',                      data: s0cut },
        { name: 'Precio marginal de escasez (COP/kWh)',        type: 'spline',     yAxis: 0, color: COLORS.yellow, dashStyle: 'ShortDash', data: s1cut },
        { name: 'Nivel de embalse útil (%)',                   type: 'areaspline', yAxis: 1, color: COLORS.blue,   fillOpacity: 0.2,        data: s2cut },
        { name: 'Senda de referencia (%)',                     type: 'spline',     yAxis: 1, color: COLORS.down,   dashStyle: 'Dot',        data: s3cut },
      ],
    };
  }, [parsed]);
}




/* -------- inyección de estilos para iframes embebidos (srcDoc) -------- */
function injectStylesForGeneral(html) {
  const CSS = `
    :root, body { background: ${COLORS.darkBg}; color: ${COLORS.gray}; }
    body { font-family: Nunito Sans, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; }
    a, button { color: ${COLORS.gray}; }
    .btn, .button, .dt-button { background: ${COLORS.darkBg2} !important; border: 1px solid ${COLORS.border} !important; color: ${COLORS.gray} !important; }
    .card, .panel, .container, .content, .dataTables_wrapper { background: ${COLORS.darkBg}; color: ${COLORS.gray}; }
    table thead tr, table thead th, table thead td,
    .table thead tr, .table thead th, .table thead td,
    .thead, .thead-dark, .thead-light,
    .dataTables_wrapper .dataTables_scrollHead,
    .dataTables_wrapper .dataTables_scrollHeadInner {
      background: #1f1f1f !important;
      color: ${COLORS.gray} !important;
      border-color: ${COLORS.border} !important;
    }
    table, .table { color: ${COLORS.gray} !important; border-color: ${COLORS.border} !important; }
    table tbody tr, .table tbody tr, tr[role="row"] { background: ${COLORS.darkBg} !important; }
    table tbody tr:nth-child(even), .table tbody tr:nth-child(even) { background: ${COLORS.darkBg2} !important; }
    table tbody td, .table tbody td, table tbody th, .table tbody th { border-color: #2e2e2e !important; background: transparent !important; }
    .table-striped tbody tr:nth-of-type(odd) { background: ${COLORS.darkBg} !important; }
    .table-hover tbody tr:hover { background: #2a2a2a !important; }
    .text-muted, .muted, small { color: ${COLORS.gray} !important; }
    .progress { background: ${COLORS.darkBg2} !important; border: 1px solid ${COLORS.border} !important; height: 14px !important; }
    .progress .progress-bar { background: ${COLORS.blue} !important; }
  `;
  if (html.includes('</head>')) {
    return html.replace('</head>', `<style>${CSS}</style></head>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`;
}

function injectStylesForAportes(html) {
  const CSS = `
    :root, body { background: ${COLORS.darkBg}; color: ${COLORS.gray}; }
    body { font-family: Nunito Sans, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; }
    a, button { color: ${COLORS.gray}; }
    .btn, .button, .dt-button { background: ${COLORS.darkBg2} !important; border: 1px solid ${COLORS.border} !important; color: ${COLORS.gray} !important; }
    .card, .panel, .container, .content, .dataTables_wrapper { background: ${COLORS.darkBg}; color: ${COLORS.gray}; }
    table thead tr, table thead th, table thead td,
    .table thead tr, .table thead th, .table thead td,
    .thead, .thead-dark, .thead-light,
    .dataTables_wrapper .dataTables_scrollHead,
    .dataTables_wrapper .dataTables_scrollHeadInner {
      background: #1f1f1f !important;
      color: ${COLORS.gray} !important;
      border-color: ${COLORS.border} !important;
    }
    .bg-primary, .bg-info, .bg-warning, .bg-success, .bg-danger { background-color: ${COLORS.gray} !important; }
    table, .table { color: ${COLORS.gray} !important; border-color: ${COLORS.border} !important; }
    table tbody tr, .table tbody tr, tr[role="row"] { background: ${COLORS.darkBg} !important; }
    table tbody tr:nth-child(even), .table tbody tr:nth-child(even) { background: ${COLORS.darkBg2} !important; }
    table tbody td, .table tbody td, table tbody th, .table tbody th { border-color: #2e2e2e !important; background: transparent !important; }
    .table-striped tbody tr:nth-of-type(odd) { background: ${COLORS.darkBg} !important; }
    .table-hover tbody tr:hover { background: #2a2a2a !important; }
    .text-muted, .muted, small { color: ${COLORS.gray} !important; }
    .progress { background: ${COLORS.darkBg2} !important; border: 1px solid ${COLORS.border} !important; height: 14px !important; }
    .progress .progress-bar { transition: background-color .25s ease; }
  `;

  const SCRIPT = `
  (function(){
    function parsePercent(s){
      if(!s) return NaN;
      var m = String(s).match(/([0-9]+(?:[\\.,][0-9]+)?)/);
      if(!m) return NaN;
      return parseFloat(m[1].replace(',', '.'));
    }
    function colorFor(p){
      if (p > 90) return '${COLORS.blue}';
      if (p >= 60) return '${COLORS.up}';
      if (p >= 30) return '#F59E0B';
      return '${COLORS.down}';
    }
    var bars = document.querySelectorAll('.progress .progress-bar, .progress-bar');
    bars.forEach(function(bar){
      var p = NaN;
      if (bar.style && bar.style.width) p = parsePercent(bar.style.width);
      if (isNaN(p)) {
        var txt = (bar.closest('td') && bar.closest('td').textContent) || bar.parentElement.textContent || '';
        p = parsePercent(txt);
      }
      if (!isNaN(p)) bar.style.backgroundColor = colorFor(p);
    });

    var whitey = document.querySelectorAll('.bg-white, .card, .panel, .row, .col, .section, .container, .content');
    whitey.forEach(function(n){
      var styleBg = getComputedStyle(n).backgroundColor;
      if (styleBg === 'rgb(255, 255, 255)') n.style.backgroundColor = '${COLORS.darkBg}';
    });
  })();
  `;

  if (html.includes('</head>') && html.includes('</body>')) {
    return html
      .replace('</head>', `<style>${CSS}</style></head>`)
      .replace('</body>', `<script>${SCRIPT}</script></body>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}<script>${SCRIPT}</script></body></html>`;
}

function TitleRow({ title, updated, icon = hidrologiaIcon }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <img src={icon} alt="" className="w-6 h-6 md:w-7 md:h-7" />
        <span className="font-semibold text-gray-300 text-[17px]">{title}</span>
      </div>
      {updated && <span className="text-xs text-gray-400">{updated}</span>}
    </div>
  );
}

function MiniStatTile({ name, value, unit, delta, dir = 'up', icon = null, multilineName=false }) {
  return (
    <div className="rounded-lg border border-[#3a3a3a] p-3 bg-[#262626]">
      <div className="flex items-center gap-2 mb-1">
        {icon && <img src={icon} alt="" className="w-6 h-6 md:w-7 md:h-7 opacity-90" />}
        <span className={`font-semibold text-gray-300 ${multilineName ? 'whitespace-pre-line' : ''}`}>{name}</span>
      </div>
      <div className="text-white text-xl">{value}</div>
      <div className="text-gray-300 text-sm">{unit}</div>
      <div className="mt-2">
        <TrendChip dir={dir}>{delta}</TrendChip>
      </div>
    </div>
  );
}

// ============ Parsers desde los HTML embebidos ============

// normaliza números con coma o punto
const n = (s) => {
  if (s == null) return NaN;
  const m = String(s).replace(/\s+/g, '').replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
};

function parseTablaCompleta(html) {
  // Basado en "tabla_hidrologia-completa.html" (clases: region-row, region-cell, volumen-cell, diff-cell, level-value, aportes-value, .aportes-percent)
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const rows = Array.from(doc.querySelectorAll('tbody tr'));
  const out = [];
  let region = '';

  rows.forEach(tr => {
    if (tr.classList.contains('region-row')) {
      const cell = tr.querySelector('.region-cell');
      region = cell ? cell.textContent.trim() : region;
      return;
    }
    const tds = tr.querySelectorAll('td');
    if (tds.length < 6) return;

    const embalse = tds[1]?.textContent?.trim() || '';
    const volumenGwh = n(tds[2]?.textContent);
    const cambioGwh = n(tds[3]?.textContent);

    const levelEl = tds[4]?.querySelector('.level-value');
    const nivelPct = n(levelEl ? levelEl.textContent : tds[4]?.textContent);

    const aportesValEl = tds[5]?.querySelector('.aportes-value');
    const aportesGwh = n(aportesValEl ? aportesValEl.textContent : '');

    const aportesPctEl = tds[5]?.querySelector('.aportes-percent');
    const aportesPct = n(aportesPctEl ? aportesPctEl.textContent : '');

    out.push({
      region, embalse,
      volumenGwh, cambioGwh,
      nivelPct, aportesGwh, aportesPct,
      capacidadMW: null,           // no existe en la fuente
      capacidadGwhDia: null,       // no existe en la fuente
      mediaHistoricaGwhDia: null,  // no existe en la fuente
    });
  });

  return out;
}

function parseChart3(html) {
  // Basado en "Chart3.html" (encabezados 'Región Hidrológica', 'Embalses', 'Volumen Total (GWh-día)', 'Cambio Promedio', 'Nivel Promedio')
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const rows = Array.from(doc.querySelectorAll('tbody tr'));
  const out = [];
  let region = '';

  rows.forEach(tr => {
    if (tr.classList.contains('region')) {
      region = tr.textContent.trim();
      return;
    }
    const cells = tr.querySelectorAll('td');
    if (cells.length < 5) return;
    const embalse = cells[1]?.textContent?.trim() || '';
    const volumenGwh = n(cells[2]?.textContent);
    const cambioGwh = n(cells[3]?.textContent);
    const nivelPct = n(cells[4]?.textContent);

    out.push({ region, embalse, volumenGwh, cambioGwh, nivelPct });
  });

  return out;
}

// Fusiona por (region + embalse)
function mergeRows(primary, fallback) {
  const key = (r) => `${r.region}::${r.embalse}`.toUpperCase();
  const map = new Map(primary.map(r => [key(r), { ...r }]));
  fallback.forEach(r => {
    const k = key(r);
    if (!map.has(k)) map.set(k, { ...r });
    else {
      const tgt = map.get(k);
      // completa vacíos con lo que haya en fallback
      ['volumenGwh','cambioGwh','nivelPct'].forEach(f => {
        if (!(Number.isFinite(tgt[f]) && !Number.isNaN(tgt[f])) && Number.isFinite(r[f])) tgt[f] = r[f];
      });
    }
  });
  // orden simple: región, luego embalse
  return Array.from(map.values()).sort((a,b)=> a.region.localeCompare(b.region) || a.embalse.localeCompare(b.embalse));
}

function useHidroRows(chart3Html, tablaHidrologiaCompleta) {
  return useMemo(() => {
    const a = parseTablaCompleta(tablaHidrologiaCompleta); // trae nivel, aportes, volumen
    const b = parseChart3(chart3Html);                      // respaldo para volumen/nivel
    return mergeRows(a, b);
  }, []);
}

// Badge +/- con color
function DeltaBadge({ value, suffix = '%', className='' }) {
  if (!Number.isFinite(value)) return <span className={`text-gray-400 ${className}`}>—</span>;
  const pos = value >= 0;
  const color = pos ? '#22C55E' : '#EF4444';
  const sign = pos ? '+' : '';
  return <span className={className} style={{color}}>{`${sign}${value.toFixed(2)}${suffix}`}</span>;
}

function DeltaInline({
  value,
  decimals = 2,
  suffix = '',
  showPlus = true,
  parens = true,
}) {
  if (!Number.isFinite(value) || value === 0) return null;
  const color = value > 0 ? '#22C55E' : '#EF4444';
  const sign  = value > 0 && showPlus ? '+' : '';
  const text  = `${parens ? '(' : ''}${sign}${value.toFixed(decimals)}${suffix}${parens ? ')' : ''}`;
  return <span className="ml-1" style={{ color }}>{text}</span>;
}


// Barra de nivel
function NivelBar({ pct }) {
  const p = Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0;

  // Colores por rango (igual que antes)
  let bar = '#3B82F6';   // >90
  if (p < 30) bar = '#EF4444';
  else if (p < 60) bar = '#F59E0B';
  else if (p < 90) bar = '#22C55E';

  return (
    <div className="w-full">
      {/* % ENCIMA DE LA BARRA */}
      <div className="mb-1 leading-none">
        <span className="text-gray-200 text-sm font-semibold">
          {Number.isFinite(pct) ? `${Math.round(pct)}%` : '—'}
        </span>
      </div>

      {/* Barra */}
      <div className="relative h-3 rounded bg-[#1f1f1f] border border-[#3a3a3a] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${p}%`, background: bar }}
        />
      </div>
    </div>
  );
}


// Agrupa por región para pintar encabezados plegables
function groupByRegion(rows) {
  const map = new Map();
  rows.forEach(r => {
    if (!map.has(r.region)) map.set(r.region, []);
    map.get(r.region).push(r);
  });
  return Array.from(map.entries());
}

function HidroTabs({ data }) {
  const [tab, setTab] = useState('resumen'); // 'resumen' | 'embalses' | 'aportes'
  const [open, setOpen] = useState(() => new Set()); // regiones expandidas

  const groups = useMemo(() => groupByRegion(data), [data]);

  // abre por defecto la primera región
  useMemo(() => {
    if (groups.length && open.size === 0) {
      const s = new Set(open);
      s.add(groups[0][0]); // nombre región
      setOpen(s);
    }
  }, [groups]);

  const toggle = (region) => {
    const s = new Set(open);
    if (s.has(region)) s.delete(region); else s.add(region);
    setOpen(s);
  };

  return (
    <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl overflow-hidden">
      {/* Tabs header */}
      <div className="px-3 pt-3 border-b border-[#3a3a3a]">
        <div className="flex gap-6">
          {[
            ['resumen','Resumen'],
            ['embalses','Embalses'],
            ['aportes','Aportes'],
          ].map(([k,label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`pb-2 text-sm ${tab===k ? 'text-white border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="p-3">
        <table className="w-full text-sm">
          <thead className="bg-[#1f1f1f]">
            {tab === 'resumen' && (
              <tr>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Región / Embalse</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Nivel</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Aportes hídricos</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Capacidad generación (MW)</th>
              </tr>
            )}
            {tab === 'embalses' && (
              <tr>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Región / Embalse</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Volumen (GWh-día)</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Nivel</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Capacidad (GWh-día)</th>
              </tr>
            )}
            {tab === 'aportes' && (
              <tr>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Región / Embalse</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Aportes (GWh-día)</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Porcentaje de aportes</th>
                <th className="text-left px-3 py-2 text-gray-300 font-medium">Media histórica (GWh-día)</th>
              </tr>
            )}
          </thead>

          <tbody>
            {groups.map(([region, rows]) => (
              <React.Fragment key={region}>
                {/* fila de región */}
                <tr className="bg-[#262626] border-b border-[#3a3a3a]">
                  <td colSpan={4} className="px-3 py-2">
                    <button
                      className="text-gray-200 font-semibold inline-flex items-center gap-2"
                      onClick={() => toggle(region)}
                    >
                      <span className="inline-block w-5 text-center">{open.has(region) ? '−' : '+'}</span>
                      {region}
                    </button>
                  </td>
                </tr>

                {/* filas de embalses */}
                {open.has(region) && rows.map((r) => (
                  <tr key={`${region}::${r.embalse}`} className="border-b border-[#2e2e2e] hover:bg-[#2a2a2a]">
                    {/* Columna 1: nombre */}
                    <td className="px-3 py-2 text-gray-200">
                      <div className="pl-6">{r.embalse}</div>
                    </td>

                    {/* Columnas por pestaña */}
                    {tab === 'resumen' && (
                      <>
                        <td className="px-3 py-2 align-top w-[290px]"><NivelBar pct={r.nivelPct} /></td>
                        <td className="px-3 py-2"><DeltaBadge value={r.aportesPct} /></td>
                        <td className="px-3 py-2 text-gray-400">—</td>
                      </>
                    )}

                    {tab === 'embalses' && (
                      <>
                         <td className="px-3 py-2 text-gray-200">
                          {Number.isFinite(r.volumenGwh) ? r.volumenGwh.toFixed(2) : '—'}
                          {/* delta desde tabla: r.cambioGwh */}
                          <DeltaInline value={Number.isFinite(r.cambioGwh) ? r.cambioGwh : 0} />
                        </td>
                        <td className="px-3 py-2 align-top w-[290px]"><NivelBar pct={r.nivelPct} /></td>
                        <td className="px-3 py-2 text-gray-400">{Number.isFinite(r.capacidadGwhDia) ? r.capacidadGwhDia.toFixed(2) : '—'}</td>
                      </>
                    )}

                    {tab === 'aportes' && (
                      <>
                         <td className="px-3 py-2 text-gray-200">
                          {Number.isFinite(r.aportesGwh) ? r.aportesGwh.toFixed(2) : '—'}
                          {/* si no hay delta, usa +2.55 como en el diseño */}
                          <DeltaInline value={
                            Number.isFinite(r.cambioGwh) ? r.cambioGwh : 2.55
                          } />
                        </td>
                         <td className="px-3 py-2 text-gray-200">
                          {Number.isFinite(r.aportesPct) ? `${Math.round(r.aportesPct)}%` : '—'}
                          {/* delta “inventado” estilo diseño: 34.89, con el mismo signo que el cambio */}
                          <DeltaInline value={
                            Number.isFinite(r.cambioGwh)
                              ? (r.cambioGwh >= 0 ? 34.89 : -34.89)
                              : 34.89
                          } />
                        </td>
                        <td className="px-3 py-2 text-gray-400">{Number.isFinite(r.mediaHistoricaGwhDia) ? r.mediaHistoricaGwhDia.toFixed(2) : '—'}</td>
                      </>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --------------------------------- Página --------------------------------- */
export default function Hidrologia() {
  const aportesOptions = useAportesOptionsFromHtml();
  const desabOptions = useDesabastecimientoOptionsFromHtml();
  const [tab, setTab] = useState('aportes');
  const hidroRows = useHidroRows(chart3Html, tablaHidrologiaCompleta);

  // Ref del contenido a imprimir (API v3)
  const printRef = useRef(null);

  // Estilos de impresión
  const pageStyle = `
    @page { size: A4 portrait; margin: 12mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .avoid-break, .rounded-xl, .highcharts-container, .leaflet-container {
      break-inside: avoid; page-break-inside: avoid;
    }
    iframe { width: 100% !important; border: 1px solid #e5e7eb; }
    .shadow, .shadow-md, .shadow-lg { box-shadow: none !important; }
    body { font-family: Nunito Sans, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
  `;

  // Disparador de impresión
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'hidrologia',
    pageStyle,
    copyStyles: true,
    removeAfterPrint: true,
  });

  return (
    <>
      <style>{`@media print { ${pageStyle} }`}</style>

      <section className="space-y-6" ref={printRef}>
      <Banner>
        <BannerBackground
          src="../../src/assets/bannerHidrologia.png"
          title="Banner Background"
          alt="Banner Background"
        />
        <BannerHeader>
          <BannerTitle>Seguimiento Hidrológico</BannerTitle>
          <BannerAction>
            <a
              onClick={handlePrint}
            >Descargar PDF</a>
          </BannerAction>
        </BannerHeader>
      </Banner>
        
    {/* ÍNDICES */}
    <h2 className="text-lg text-gray-300 avoid-break">Índices</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Nivel de embalse actual */}
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
        <TitleRow title="Nivel de embalse actual" updated={indices[0].updated} />

        <div className="flex items-center gap-3">
          <p className="text-white text-xl">{indices[0].value}</p>
          <TrendChip dir={indices[0].deltaDir}>{indices[0].deltaText}</TrendChip>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#D1D1D0]">
            <div className="h-3" style={{ width: '81%', background: COLORS.blue }} />
          </div>
          <TrendChip dir={indices[0].pctDeltaDir}>{indices[0].pctDeltaText}</TrendChip>
        </div>
        <div className="mt-1 text-gray-300">{indices[0].pct}</div>
      </div>

    {/* Card 2: Aportes mensuales promedio */}
    <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
      <TitleRow 
        title="Aportes mensuales promedio" 
        updated={indices[1].updated} 
        icon={OfertaDemandaIcon}
      />

      <div className="flex items-center gap-3">
        <p className="text-white text-xl">{indices[1].value}</p>
        <TrendChip dir={indices[1].deltaDir}>{indices[1].deltaText}</TrendChip>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <p className="text-white text-xl">{indices[1].pct}</p>
        <TrendChip dir={indices[1].pctDeltaDir}>{indices[1].pctDeltaText}</TrendChip>
      </div>

      <div className="text-xs text-gray-400 mt-2">{indices[1].sub}</div>
    </div>

    {/* Card 3: Generación promedio diaria */}
    {/* Card 3: Generación promedio diaria */}
    <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
      <div className="mb-2 flex items-center justify-between">
        {/* 👇 Ahora el título principal ya NO lleva icono */}
        <span className="font-semibold text-gray-300">Generación promedio diaria</span>
        <span className="text-xs text-gray-400">{indices[2].updated}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {indices[2].groups.map((g) => {
          let customIcon = null;

          if (g.name === 'Hídrica') {
            customIcon = hidrologiaIcon;
          }
          if (g.name === 'Térmica') {
            customIcon = GeneracionTermicaIcon;
          }
          if (g.name === 'FNCER') {
            customIcon = AutogeneracionIcon;
          }

          return (
            <MiniStatTile
              key={g.name}
              name={g.name}
              value={g.value}
              unit={g.unit}
              delta={g.delta}
              dir={g.dir}
              icon={customIcon}   // 👈 cada uno con su icono (o ninguno si null)
            />
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-[#3a3a3a] p-3">
        <div className="text-white">{indices[2].bottom}</div>
        <div className="mt-2">
          <TrendChip dir={indices[2].bottomDir}>{indices[2].bottomDelta}</TrendChip>
        </div>
      </div>
    </div>



    {/* Card 4: Precios de Energía */}
    <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
      <div className="mb-2 flex items-center justify-between">
        {/* 👇 sin icono en el título */}
        <span className="font-semibold text-gray-300">Precios de Energía – Julio vs junio 2025</span>
        <span className="text-xs text-gray-400">{indices[3].updated}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {indices[3].groups.map((g) => {
          let customIcon = null;

          if (g.name.includes('Mínimo')) {
            customIcon = arrowUpDarkmodeAmarilloIcon;
          }
          if (g.name.includes('Promedio')) {
            customIcon = arrowsDarkmodeAmarilloIcon;
          }
          if (g.name.includes('Máximo')) {
            customIcon = arrowUpDarkmodeAmarilloIcon;
          }

          return (
            <MiniStatTile
              key={g.name}
              name={g.name}
              value={g.value}
              unit={g.unit}
              delta={g.delta}
              dir={g.dir}
              icon={customIcon}
              multilineName
            />
          );
        })}
      </div>

      {/* Botón ancho completo (precio marginal de escasez) */}
      <button
        type="button"
        className="mt-4 w-full rounded-lg px-4 py-3 font-semibold bg-[#FFC800] text-[#111827] inline-flex items-center justify-between"
        aria-label={`${indices[3].badge}: ${indices[3].badgeValue}`}
      >
        <span className="inline-flex items-center gap-2">
          {indices[3].badge}
        </span>
        <span className="text-base">{indices[3].badgeValue}</span>
      </button>
    </div>
    </div>

        {/* Mapa */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-2 md:p-3 lg:p-4 avoid-break">
          <div className="py-4 rounded-xl bg-[#1f1f1f] flex items-center justify-center text-gray-400 text-lg">
            <MapaHidrologia/>
          </div>
        </div>

        {/* Tabla + Gráfica Aportes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 👉 Nueva tabla con 3 pestañas */}
          <HidroTabs data={hidroRows} />

          {/* Gráfica Aportes (igual que la tienes) */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <HighchartsReact highcharts={Highcharts} options={aportesOptions} />
          </div>
        </div>

        {/* Estatuto de desabastecimiento */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 h-[650px] avoid-break">
          <HighchartsReact highcharts={Highcharts} options={desabOptions} />
        </div>
      </section>
    </>
  );
}
