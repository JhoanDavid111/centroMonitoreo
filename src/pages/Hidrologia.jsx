// src/pages/Hidrologia.jsx
import bannerHidrologia from '../../src/assets/bannerHidrologia.png';
import { HidrologiaComponent } from "../components/SideInfoHidrologia";
import {
  Banner,
  BannerAction,
  BannerBackground,
  BannerHeader,
  BannerTitle
} from '../components/ui/Banner';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

// HTML embebidos
import AutogeneracionIcon from '../assets/svg-icons/Autogeneracion-On.svg';
import GeneracionTermicaIcon from '../assets/svg-icons/GeneracionTermica-On.svg';
import hidrologiaIcon from '../assets/svg-icons/Hidrologia-On.svg';
import OfertaDemandaIcon from '../assets/svg-icons/OfertaDemanda-On.svg';
import arrowUpDarkmodeAmarilloIcon from '../assets/svg-icons/arrowUpDarkmodeAmarillo.svg';
import arrowsDarkmodeAmarilloIcon from '../assets/svg-icons/arrowsDarkmodeAmarillo.svg';
import chart1Html from '../data/Chart1.html?raw';
import chart3Html from '../data/Chart3.html?raw'; // Información general
import tablaHidrologiaCompleta from '../data/tabla_hidrologia-completa.html?raw'; // Aportes hídricos
import { API } from '../config/api';

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

// ===== Endpoints =====
import { API } from '../config/api';

const API_HIDRO = import.meta.env.VITE_API_HIDRO || `${API}/v1/indicadores/hidrologia/indicadores_hidraulicos`;
const API_APORTES = import.meta.env.VITE_API_HIDRO_APORTES || `${API}/v1/graficas/hidrologia/grafica_aportes`;
const API_ESTATUTO = import.meta.env.VITE_API_ESTATUTO || `${API}/v1/graficas/energia_electrica/grafica_estatuto`;

/* ==================== helpers ==================== */
// (dejamos solo lo necesario para otras partes)
const extractCategories = (html) => {
  const m = html.match(/xAxis:\s*\{\s*categories:\s*\[([\s\S]*?)\]\s*,/);
  if (!m) return [];
  return [...m[1].matchAll(/'([^']+)'/g)].map(mm => mm[1]);
};

const extractAllSeriesUTCGeneric = (html) => {
  const out = [];
  const re = /\{\s*name\s*:\s*['"]([^'"]+)['"][\s\S]*?data\s*:\s*\[([\s\S]*?)\][\s\S]*?\}/g;
  let m;
  while ((m = re.exec(html))) {
    const name = m[1];
    const dataBlock = m[2];
    const utc = [];
    const r2 = /\bDate\.UTC\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*[,]?\s*([\-\d.,]+)/g;
    let mm;
    while ((mm = r2.exec(dataBlock))) {
      utc.push([Date.UTC(+mm[1], +mm[2], +mm[3]), parseFloat(String(mm[4]).replace(',', '.'))]);
    }
    const num = dataBlock
      .split(',')
      .map(s => parseFloat(String(s).replace(',', '.')))
      .filter(v => Number.isFinite(v));
    out.push({ name, utc, num });
  }
  return out;
};

// Tiempo / límites
const EPOCH_FLOOR = Date.UTC(1971, 0, 1);
const HARD_MAX_JUL2025 = Date.UTC(2025, 6, 31);
function ymToUtc(ym) {
  const m = String(ym).match(/^(\d{4})-(\d{2})$/);
  if (!m) return NaN;
  return Date.UTC(+m[1], (+m[2]) - 1, 1);
}

/* ======================= Índices (defaults) ======================= */
const defaultIndices = [
  {
    title: 'Nivel de embalse actual',
    updated: '—',
    value: '—',
    deltaText: '—',
    deltaDir: 'down',
    pct: '—',
    pctDeltaText: '—',
    pctDeltaDir: 'down',
    pctValueNum: 0,
  },
  {
    title: 'Aportes mensuales promedio',
    updated: '—',
    value: '—',
    deltaText: '—',
    deltaDir: 'down',
    pct: '—',
    pctDeltaText: '—',
    pctDeltaDir: 'down',
    sub: 'Media histórica: —',
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
    title: 'Precios de energía – Julio vs junio 2025',
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
        inline-flex items-center gap-1 px-3 py-1
        rounded-full text-sm font-semibold
        whitespace-nowrap leading-none
      "
      style={{
        backgroundColor: bg,
        color: '#fff',
        border: '1px solid rgba(0,0,0,.15)',
        fontSize: '12px'
      }}
    >
      <span aria-hidden className="text-base leading-none">{isUp ? '↑' : '↓'}</span>
      <span className="leading-none" style={{ color: '#fff' }}>{children}</span>
    </span>
  );
}

/* =================== Highcharts (APORTES desde API) =================== */
function useAportesOptionsFromApi() {
  const [series, setSeries] = useState({ s1: [], s2: [], s3: [] }); // GWh, Media Histórica, % útil
  const [range, setRange] = useState({ minX: undefined, maxX: undefined });

  useEffect(() => {
    let abort = false;
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(API_APORTES, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-store',
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const ct = (res.headers.get('content-type') || '').toLowerCase();
        const data = ct.includes('application/json') ? await res.json() : JSON.parse(await res.text());

        if (abort || !Array.isArray(data)) return;

        const s1 = []; // aportes_gwh
        const s2 = []; // aportes_media_historica
        const s3 = []; // porcentaje_util
        for (const row of data) {
          const x = ymToUtc(row.mes);
          if (!Number.isFinite(x)) continue;
          const gwh = Number(row.aportes_gwh);
          const media = Number(row.aportes_media_historica);
          const pct = Number(row.porcentaje_util);
          if (Number.isFinite(gwh)) s1.push([x, gwh]);
          if (Number.isFinite(media)) s2.push([x, media]);
          if (Number.isFinite(pct)) s3.push([x, pct]);
        }
        s1.sort((a,b)=>a[0]-b[0]); s2.sort((a,b)=>a[0]-b[0]); s3.sort((a,b)=>a[0]-b[0]);

        const allX = [...s1, ...s2, ...s3].map(p=>p[0]);
        const minX = allX.length ? Math.max(Math.min(...allX), EPOCH_FLOOR) : undefined;
        const maxX = allX.length ? Math.min(Math.max(...allX), HARD_MAX_JUL2025) : undefined;

        setSeries({ s1, s2, s3 });
        setRange({ minX, maxX });
      } catch (err) {
        console.error('[Aportes API] Error:', err);
        setSeries({ s1: [], s2: [], s3: [] });
        setRange({ minX: undefined, maxX: undefined });
      }
    })();
    return () => { abort = true; ac.abort(); };
  }, []);

  return useMemo(() => ({
    chart: {
      backgroundColor: COLORS.darkBg,
      height: 650,
      marginTop: 80,
      marginBottom: 180,
      spacingBottom: 40,
    },
    title: {
      text: 'Aportes y nivel útil de embalses por mes',
      align: 'left',
      style: { color: '#fff', fontSize: '1.65em' }
    },
    subtitle: { text: '', align: 'left', style: { color: COLORS.gray } },
    xAxis: {
      type: 'datetime',
      min: range.minX,
      max: range.maxX,
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
    plotOptions: { series: { marker: { radius: 3, enabled: false }, lineWidth: 2, turboThreshold: 0 } },
    series: [
      { name: 'Aportes (GWh-dia)', type: 'line', color: '#05d80a', data: series.s1, tooltip: { valueSuffix: ' GWh-dia' } },
      { name: 'Aportes Media Histórica (GWh-dia)', type: 'line', color: COLORS.yellow, dashStyle: 'Dash', data: series.s2, tooltip: { valueSuffix: ' GWh-dia' } },
      { name: 'Nivel de Embalse Util (%)', type: 'area', yAxis: 1, color: COLORS.blue, fillOpacity: 0.3, lineWidth: 1, data: series.s3, tooltip: { valueSuffix: '%' } },
    ],
    tooltip: {
      backgroundColor: '#262626',
      style: { color: '#FFF', fontSize: '14px' },
      xDateFormat: '%Y-%m',
      shared: true,
      useHTML: true,
      formatter: function () {
        let header = `<b>${Highcharts.dateFormat('%e %b %Y', this.x)}</b><br/>`;
        let rows = this.points
          .map((point) => {
            let suffix =
              (point.series.options.tooltip &&
                point.series.options.tooltip.valueSuffix) ||
              '';
            return `
            <div style="user-select:text;pointer-events:auto;margin:10px 0;">
              <span style="color:${point.color};  fontSize:20px;">● </span>
              ${point.series.name}: <b>${Highcharts.numberFormat(
                point.y,
                2
              )}${suffix}</b>
            </div>
          `;
          })
          .join('');
        return `<div style="padding:5px;">${header}${rows}</div>`;
      },
    },
  }), [series, range]);
}

/* =================== Highcharts (Desabastecimiento desde HTML) =================== */
/* =================== Highcharts (Estatuto desde API) =================== */
function useDesabastecimientoOptionsFromApi() {
  const [series, setSeries] = useState({ pBolsa: [], pEscasez: [], nivelPct: [], sendaPct: [] });
  const [range, setRange] = useState({ minX: undefined, maxX: undefined });

  useEffect(() => {
    let abort = false;
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(API_ESTATUTO, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-store',
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const ct = (res.headers.get('content-type') || '').toLowerCase();
        const data = ct.includes('application/json') ? await res.json() : JSON.parse(await res.text());
        if (abort || !Array.isArray(data)) return;

        const pBolsa = [];
        const pEscasez = [];
        const nivelPct = [];
        const sendaPct = [];

        for (const r of data) {
          const [y, m, d] = String(r.fecha || '').split('-').map(Number);
          const x = Number.isFinite(y) && Number.isFinite(m) && Number.isFinite(d) ? Date.UTC(y, m - 1, d) : NaN;
          if (!Number.isFinite(x)) continue;

          const bolsa = Number(r['Precio de Bolsa en Períodos Punta']);
          const escasez = Number(r['Precio Marginal de Escasez']);
          let nivel = Number(r['Volumen útil del embalse']);
          let senda = r['Senda de Referencia'];
          senda = senda == null ? NaN : Number(senda);

          // el nivel suele venir 0–1: convierto a %
          if (Number.isFinite(nivel)) nivel = nivel <= 1 ? nivel * 100 : nivel;
          if (Number.isFinite(senda)) senda = senda <= 1 ? senda * 100 : senda;

          if (Number.isFinite(bolsa))   pBolsa.push([x, bolsa]);
          if (Number.isFinite(escasez)) pEscasez.push([x, escasez]);
          if (Number.isFinite(nivel))   nivelPct.push([x, nivel]);
          if (Number.isFinite(senda))   sendaPct.push([x, senda]);
        }

        // ordenar y calcular rango
        [pBolsa, pEscasez, nivelPct, sendaPct].forEach(arr => arr.sort((a, b) => a[0] - b[0]));
        const allX = [...pBolsa, ...pEscasez, ...nivelPct, ...sendaPct].map(p => p[0]);
        const minX = allX.length ? Math.min(...allX) : undefined;
        const maxX = allX.length ? Math.max(...allX) : undefined;

        setSeries({ pBolsa, pEscasez, nivelPct, sendaPct });
        setRange({ minX, maxX });
      } catch (e) {
        console.error('[Estatuto API] Error:', e);
        setSeries({ pBolsa: [], pEscasez: [], nivelPct: [], sendaPct: [] });
        setRange({ minX: undefined, maxX: undefined });
      }
    })();
    return () => { abort = true; ac.abort(); };
  }, []);

  return useMemo(() => ({
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
      min: range.minX,
      max: range.maxX,
      gridLineWidth: 1,
      gridLineColor: '#444',
      labels: {
        rotation: -45,
        align: 'right',
        autoRotation: undefined,
        style: { color: COLORS.gray, fontSize: '12px' },
        formatter() { return Highcharts.dateFormat('%Y-%m', this.value); },
      },
      title: { text: 'Fecha', style: { color: COLORS.gray, fontSize: '16px' } },
    },
    yAxis: [
      { // precios
        title: { text: 'Precios (COP/kWh)', style: { color: COLORS.gray, fontSize: '16px' } },
        labels: { style: { color: COLORS.gray, fontSize: '12px' } }
      },
      { // % embalse
        title: { text: 'Nivel de Embalse Útil (%)', style: { color: COLORS.gray, fontSize: '16px' } },
        labels: { format: '{value}%', style: { color: COLORS.gray, fontSize: '12px' } },
        opposite: true
      },
    ],
    legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', y: 20, itemStyle: { color: COLORS.gray, fontSize: '16px' } },
    plotOptions: { series: { marker: { enabled: false }, turboThreshold: 0 } },
    series: [
      { name: 'Precio de bolsa en períodos punta (COP/kWh)', type: 'spline', yAxis: 0, color: '#05d80a', data: series.pBolsa },
      { name: 'Precio marginal de escasez (COP/kWh)',        type: 'spline', yAxis: 0, color: COLORS.yellow, dashStyle: 'ShortDash', data: series.pEscasez },
      { name: 'Nivel de embalse útil (%)',                   type: 'areaspline', yAxis: 1, color: COLORS.blue, fillOpacity: 0.2, data: series.nivelPct, tooltip: { valueSuffix: '%' } },
      ...(series.sendaPct.length
        ? [{ name: 'Senda de referencia (%)', type: 'spline', yAxis: 1, color: COLORS.down, dashStyle: 'Dot', data: series.sendaPct, tooltip: { valueSuffix: '%' } }]
        : []),
    ],
    tooltip: {
      backgroundColor: '#262626',
      valueDecimals: 2,
      style: { color: '#FFF', fontSize: '14px' },
      shared: true,
      useHTML: true,
      formatter: function () {
        let header = `<b>${Highcharts.dateFormat('%e %b %Y', this.x)}</b><br/>`;
        let rows = this.points
          .map(point => `
            <div style="user-select:text;pointer-events:auto; margin:5px 0 10px 0;">
              <span style="color:${point.color}; fontSize:20px;">● </span>
              ${point.series.name}: <b>${Highcharts.numberFormat(point.y, 2)}${point.series.yAxis?.options?.title?.text?.includes('%') ? '%' : ''}</b>
            </div>
          `).join('');
        return `<div style="padding:0px;">${header}${rows}</div>`;
      },
    },
  }), [series, range]);
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
    <div className="rounded-lg border border-[#3a3a3a] p-3 bg-[#262626]w-full min-w-40">
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

// normaliza números con coma o punto
const n = (s) => {
  if (s == null) return NaN;
  const m = String(s).replace(/\s+/g, '').replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
};

function parseTablaCompleta(html) {
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
      capacidadMW: null,
      capacidadGwhDia: null,
      mediaHistoricaGwhDia: null,
    });
  });

  return out;
}

function parseChart3(html) {
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

function mergeRows(primary, fallback) {
  const key = (r) => `${r.region}::${r.embalse}`.toUpperCase();
  const map = new Map(primary.map(r => [key(r), { ...r }]));
  fallback.forEach(r => {
    const k = key(r);
    if (!map.has(k)) map.set(k, { ...r });
    else {
      const tgt = map.get(k);
      ['volumenGwh','cambioGwh','nivelPct'].forEach(f => {
        if (!(Number.isFinite(tgt[f]) && !Number.isNaN(tgt[f])) && Number.isFinite(r[f])) tgt[f] = r[f];
      });
    }
  });
  return Array.from(map.values()).sort((a,b)=> a.region.localeCompare(b.region) || a.embalse.localeCompare(b.embalse));
}

function useHidroRows(chart3Html, tablaHidrologiaCompleta) {
  return useMemo(() => {
    const a = parseTablaCompleta(tablaHidrologiaCompleta);
    const b = parseChart3(chart3Html);
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

  let bar = '#3B82F6';
  if (p < 30) bar = '#EF4444';
  else if (p < 60) bar = '#F59E0B';
  else if (p < 90) bar = '#22C55E';

  return (
    <div className="w-full">
      <div className="mb-1 leading-none">
        <span className="text-gray-200 text-sm font-semibold">
          {Number.isFinite(pct) ? `${Math.round(pct)}%` : '—'}
        </span>
      </div>
      <div className="relative h-3 rounded bg-[#1f1f1f] border border-[#3a3a3a] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${p}%`, background: bar }}
        />
      </div>
    </div>
  );
}

// Agrupa por región
function groupByRegion(rows) {
  const map = new Map();
  rows.forEach(r => {
    if (!map.has(r.region)) map.set(r.region, []);
    map.get(r.region).push(r);
  });
  return Array.from(map.entries());
}

function HidroTabs({ data }) {
  const [tab, setTab] = useState('resumen');
  const [open, setOpen] = useState(() => new Set());
  const groups = useMemo(() => groupByRegion(data), [data]);

  useMemo(() => {
    if (groups.length && open.size === 0) {
      const s = new Set(open);
      s.add(groups[0][0]);
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

                {open.has(region) && rows.map((r) => (
                  <tr key={`${region}::${r.embalse}`} className="border-b border-[#2e2e2e] hover:bg-[#2a2a2a]">
                    <td className="px-3 py-2 text-gray-200">
                      <div className="pl-6">{r.embalse}</div>
                    </td>

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
                          <DeltaInline value={Number.isFinite(r.cambioGwh) ? r.cambioGwh : 2.55} />
                        </td>
                        <td className="px-3 py-2 text-gray-200">
                          {Number.isFinite(r.aportesPct) ? `${Math.round(r.aportesPct)}%` : '—'}
                          <DeltaInline value={Number.isFinite(r.cambioGwh) ? (r.cambioGwh >= 0 ? 34.89 : -34.89) : 34.89} />
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
  // ⬇️ AHORA LA GRÁFICA DE APORTES USA API
  const aportesOptions = useAportesOptionsFromApi();
  const desabOptions = useDesabastecimientoOptionsFromApi();
  const [tab, setTab] = useState('aportes');
  const hidroRows = useHidroRows(chart3Html, tablaHidrologiaCompleta);

  // === Índices desde API (sin cambios) ===
  const [indices, setIndices] = useState(defaultIndices);
  const [loadingIdx, setLoadingIdx] = useState(false);

  // Helpers de formato
  const fmtGwh = (v) => Number.isFinite(v) ? `${v.toLocaleString('es-CO', { maximumFractionDigits: 2 })} GWh-día` : '—';
  const fmtPct = (v, opts = { maximumFractionDigits: 2 }) => Number.isFinite(v) ? `${v.toLocaleString('es-CO', opts)}%` : '—';
  const fmtSigned = (v, suffix='') => Number.isFinite(v)
    ? `${v >= 0 ? '+' : ''}${v.toLocaleString('es-CO', { maximumFractionDigits: 2 })}${suffix}`
    : '—';
  const dirFrom = (v) => (Number.isFinite(v) && v < 0 ? 'down' : 'up');
  const monthEs = (m) => ([
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ][Math.max(0, Math.min(11, (m|0)-1))] || '—');

  // Fetch indicadores hidráulicos
  useEffect(() => {
    let abort = false;
    async function load() {
      setLoadingIdx(true);
      try {
        const res = await fetch(API_HIDRO, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

        const ct = (res.headers.get('content-type') || '').toLowerCase();
        const j = ct.includes('application/json') ? await res.json() : JSON.parse(await res.text());
        if (abort || !j) return;

        const asNum = (v) => {
          const n = typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v);
          return Number.isFinite(n) ? n : NaN;
        };

        const fecha = j.fecha;
        const [yy, mm, dd] = String(fecha || '').split('-');
        const updatedEmbalse = (yy && mm && dd) ? `${dd.padStart(2,'0')}/${mm.padStart(2,'0')}/${yy}` : '—';

        const volUtil = asNum(j.volumen_util_gwh);
        const pctUtil = asNum(j.porcentaje_util);
        const difVol = asNum(j.dif_volumen_diario);
        const difPct = asNum(j.dif_porcentaje_diario);

        const mes = asNum(j.mes);
        const anio = asNum(j.año ?? j.anio ?? j.year);
        const aportesProm = asNum(j.aportes_mensual_promedio);
        const aportesPctRaw = asNum(j.aportes_porcentaje_mensual);
        const mediaHist = asNum(j.aportes_media_historica);
        const difAportes = asNum(j.dif_aportes_mensual);
        const difAportesPctRaw = asNum(j.dif_aportes_porcentaje_mensual);
        const normalizePct = (x) => (!Number.isFinite(x) ? NaN : (x <= 1 ? x * 100 : x));

        const aportesPct = normalizePct(aportesPctRaw);
        const difAportesPct = normalizePct(difAportesPctRaw);

        const i0 = {
          title: 'Nivel de embalse actual',
          updated: updatedEmbalse,
          value: fmtGwh(volUtil),
          deltaText: fmtSigned(difVol, ' GWh'),
          deltaDir: dirFrom(difVol),
          pct: fmtPct(pctUtil),
          pctDeltaText: fmtSigned(difPct, '%'),
          pctDeltaDir: dirFrom(difPct),
          pctValueNum: Number.isFinite(pctUtil) ? pctUtil : 0,
        };

        const i1 = {
          title: 'Aportes mensuales promedio',
          updated: (Number.isFinite(mes) && Number.isFinite(anio)) ? `${monthEs(mes)} ${anio}` : '—',
          value: fmtGwh(aportesProm),
          deltaText: fmtSigned(difAportes, ' GWh'),
          deltaDir: dirFrom(difAportes),
          pct: fmtPct(aportesPct),
          pctDeltaText: fmtSigned(difAportesPct, '%'),
          pctDeltaDir: dirFrom(difAportesPct),
          sub: `Media histórica: ${fmtGwh(mediaHist)}`,
        };

        setIndices((prev) => {
          const copy = [...prev];
          copy[0] = i0;
          copy[1] = i1;
          return copy;
        });
      } catch (e) {
        console.error('[Hidrologia] Error cargando indicadores:', e);
        setIndices((prev) => {
          const copy = [...prev];
          copy[0] = { ...prev[0], updated: 'Error al cargar', value: '—', pct: '—', pctValueNum: 0, deltaText: '—', pctDeltaText: '—' };
          copy[1] = { ...prev[1], updated: 'Error al cargar', value: '—', pct: '—', sub: 'Media histórica: —', deltaText: '—', pctDeltaText: '—' };
          return copy;
        });
      } finally {
        if (!abort) setLoadingIdx(false);
      }
    }
    load();
    return () => { abort = true; };
  }, [API_HIDRO]);

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
            src={bannerHidrologia}
            title="Banner Background"
            alt="Banner Background"
          />
          <BannerHeader>
            <BannerTitle>Seguimiento Hidrológico</BannerTitle>
            <BannerAction>
              <a onClick={handlePrint}>Descargar PDF</a>
            </BannerAction>
          </BannerHeader>
        </Banner>

        {/* ÍNDICES */}
        <h2 className="text-2xl font-semibold text-gray-300 avoid-break">Índices</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <TitleRow title="Nivel de embalse actual" updated={indices[0].updated} />

            <div className="flex items-center gap-3">
              <p className="text-white text-xl">{indices[0].value}</p>
              <TrendChip dir={indices[0].deltaDir}>{indices[0].deltaText}</TrendChip>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-3 rounded-full overflow-hidden bg-[#D1D1D0]">
                <div
                  className="h-3"
                  style={{ width: `${Math.max(0, Math.min(100, indices[0].pctValueNum || 0))}%`, background: COLORS.blue }}
                />
              </div>
              <TrendChip dir={indices[0].pctDeltaDir}>{indices[0].pctDeltaText}</TrendChip>
            </div>
            <div className="mt-1 text-gray-300">{indices[0].pct}</div>
          </div>

          {/* Card 2 */}
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

          {/* Card 3 */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-gray-300">Generación promedio diaria</span>
              <span className="text-xs text-gray-400">{defaultIndices[2].updated}</span>
            </div>

            <div className="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {defaultIndices[2].groups.map((g) => {
                let customIcon = null;
                if (g.name === 'Hídrica') customIcon = hidrologiaIcon;
                if (g.name === 'Térmica') customIcon = GeneracionTermicaIcon;
                if (g.name === 'FNCER') customIcon = AutogeneracionIcon;

                return (
                  <MiniStatTile
                    key={g.name}
                    name={g.name}
                    value={g.value}
                    unit={g.unit}
                    delta={g.delta}
                    dir={g.dir}
                    icon={customIcon}
                  />
                );
              })}
            </div>

            <div className="mt-4 rounded-lg border border-[#3a3a3a] p-3">
              <div className="text-white">{defaultIndices[2].bottom}</div>
              <div className="mt-2">
                <TrendChip dir={defaultIndices[2].bottomDir}>{defaultIndices[2].bottomDelta}</TrendChip>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4 avoid-break">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-gray-300">Precios de energía – Julio vs junio 2025</span>
              <span className="text-xs text-gray-400">{defaultIndices[3].updated}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {defaultIndices[3].groups.map((g) => {
                let customIcon = null;
                if (g.name.includes('Mínimo')) customIcon = arrowUpDarkmodeAmarilloIcon;
                if (g.name.includes('Promedio')) customIcon = arrowsDarkmodeAmarilloIcon;
                if (g.name.includes('Máximo')) customIcon = arrowUpDarkmodeAmarilloIcon;

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

            <button
              type="button"
              className="mt-4 w-full rounded-lg px-4 py-3 font-semibold bg-[#FFC800] text-[#111827] inline-flex items-center justify-between"
              aria-label={`${defaultIndices[3].badge}: ${defaultIndices[3].badgeValue}`}
            >
              <span className="inline-flex items-center gap-2">
                {defaultIndices[3].badge}
              </span>
              <span className="text-base">{defaultIndices[3].badgeValue}</span>
            </button>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl avoid-break flex flex-col md:flex-row">
          <HidrologiaComponent />
          <MapaHidrologia/>
        </div>

        {/* Tabla + Gráfica Aportes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HidroTabs data={hidroRows} />
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


