// src/pages/Hidrologia.jsx
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// ⬇️ Ajusta estas rutas si tus HTML viven en otra carpeta
import chart1Html from '../data/Chart1.html?raw';
import chart2Html from '../data/Chart2.html?raw';
import bannerHidrologia from '../assets/bannerHidrologia.png';

// ===== Paleta (según tu guía de colores) =====
const COLORS = {
  down: '#EF4444',   // chip rojo (↓)
  up: '#86EFAC',     // chip verde (↑)
  blue: '#3B82F6',   // barras/áreas azules
  gray: '#D1D1D0',   // textos grises
  yellow: '#FFC800',
  chipText: '#111827',
};

// =========== Utilidades de parseo para leer datos del HTML ===========
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
  const re = /\[Date\.UTC\((\d+),\s*(\d+),\s*(\d+)\)\s*,\s*([0-9.\-]+)\]/g;
  let mm;
  while ((mm = re.exec(src))) {
    const y = +mm[1], m = +mm[2], d = +mm[3], val = parseFloat(mm[4]);
    out.push([Date.UTC(y, m, d), val]);
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

// ======================= Índices (mock visual) =======================
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

// Chip visual ↑/↓
function TrendChip({ dir = 'up', children }) {
  const isUp = dir === 'up';
  const bg = isUp ? COLORS.up : COLORS.down;
  const arrow = isUp ? '↑' : '↓';
  return (
    <span
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-2xl text-sm font-semibold"
      style={{ background: bg, color: COLORS.chipText }}
    >
      <span className="text-base leading-none" style={{ color: '#111' }}>{arrow}</span>
      <span className="tracking-tight">{children}</span>
    </span>
  );
}

// Tabla mock
const regiones = [
  { region: 'ANTIOQUIA', embalses: 10, volumen: 57 },
  { region: 'CALDAS', embalses: 1, volumen: 13 },
  { region: 'CARIBE', embalses: 1, volumen: 12 },
  { region: 'CENTRO', embalses: 6, volumen: 48 },
  { region: 'ORIENTE', embalses: 3, volumen: 32 },
  { region: 'VALLE', embalses: 3, volumen: 68 },
];

// =================== Opciones Highcharts con datos de tus HTML ===================

// Chart2 – “Aportes y nivel útil…”
function useAportesOptionsFromHtml() {
  const aportes = useMemo(() => {
    const s1 = extractSeriesByNameUTC(chart2Html, 'Aportes (GWh-dia)');
    const s2 = extractSeriesByNameUTC(chart2Html, 'Aportes Media Histórica (GWh-dia)');
    const s3 = extractSeriesByNameUTC(chart2Html, 'Nivel de Embalse Util (%)');
    return { s1, s2, s3 };
  }, []);

  return useMemo(() => ({
    chart: {
    zoomType: 'xy',
    backgroundColor: '#262626',
    height: 500,         // ↑ Aumenta altura total
    marginTop: 80,
    marginBottom: 180,   // ↑ Más espacio para eje X y leyenda
    spacingBottom: 40    // ↑ Colchón extra
    },
    title: { text: 'Aportes y nivel útil de embalses', align: 'left', style: { color: '#fff', fontSize: '1.65em' } },
    subtitle: { text: 'Fuente: XM - SINERGOX', align: 'left', style: { color: COLORS.gray } },

    // ⬇️ Ajustes clave del eje X
    xAxis: {
      type: 'datetime',
      gridLineWidth: 1,
      gridLineColor: '#444',
      tickPixelInterval: 130, // ← menos marcas (ajusta 110–160 según ancho)
      // Si prefieres exactamente una por mes, usa: tickInterval: 30 * 24 * 3600 * 1000,
      labels: {
        rotation: -45,
        align: 'right',
        autoRotation: undefined,                // evita re-rotaciones automáticas
        formatter() {                           // etiqueta compacta AAAA-MM
          return Highcharts.dateFormat('%Y-%m', this.value);
        },
        style: { color: COLORS.gray, fontSize: '12px' }
      }
    },

    yAxis: [
      { /* ... como ya lo tienes ... */ },
      { /* ... como ya lo tienes ... */ },
    ],

    // ⬇️ Mueve la leyenda un poco más abajo para que no pise el eje
    legend: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom',
    y: 20, // deja espacio entre leyenda y eje
    itemStyle: { color: '#fff', fontSize: '16px' }
    },

    tooltip: { shared: true, xDateFormat: '%Y-%m', backgroundColor: 'rgba(0,0,0,.85)', style: { color: '#f0f0f0' } },
    series: [
      { name: 'Aportes (GWh-dia)', type: 'line', color: '#05d80a', marker: { radius: 3 }, lineWidth: 2, data: aportes.s1, tooltip: { valueSuffix: ' GWh-dia' } },
      { name: 'Aportes Media Histórica (GWh-dia)', type: 'line', color: '#ffc800', dashStyle: 'Dash', marker: { radius: 3 }, lineWidth: 2, data: aportes.s2, tooltip: { valueSuffix: ' GWh-dia' } },
      { name: 'Nivel de Embalse Util (%)', type: 'area', yAxis: 1, color: COLORS.blue, fillOpacity: 0.3, lineWidth: 1, data: aportes.s3, tooltip: { valueSuffix: '%' } },
    ],
  }), [aportes]);
}


// Chart1 – “Estatuto de desabastecimiento”
function useDesabastecimientoOptionsFromHtml() {
  const parsed = useMemo(() => {
    const categories = extractCategories(chart1Html);
    const series = extractAllNumericSeries(chart1Html);
    return { categories, series };
  }, []);

  const s0 = parsed.series?.[0]?.data ?? [];
  const s1 = parsed.series?.[1]?.data ?? [];
  const s2 = parsed.series?.[2]?.data ?? [];
  const s3 = parsed.series?.[3]?.data ?? [];

  return useMemo(() => ({
    chart: { zooming: { type: 'xy' }, backgroundColor: '#262626', marginTop: 130, marginBottom: 170, spacingBottom: 60 },
    title: { text: 'Estatuto de desabastecimiento', align: 'left', margin: 50, style: { color: '#fff', fontSize: '1.65em' } },
    subtitle: { text: 'Fuente: XM - SINERGOX', align: 'left', style: { color: COLORS.gray } },
    xAxis: {
      categories: parsed.categories,
      labels: { style: { color: COLORS.gray, fontSize: '14px' } },
      title: { text: 'Fecha', style: { color: COLORS.gray, fontSize: '16px' } },
    },
    yAxis: [
      { title: { text: 'Precios (COP/kWh)', style: { color: COLORS.gray, fontSize: '16px' } }, labels: { style: { color: COLORS.gray, fontSize: '14px' } } },
      { title: { text: 'Nivel de Embalse Util (%)', style: { color: COLORS.gray, fontSize: '16px' } }, labels: { format: '{value}%', style: { color: COLORS.gray, fontSize: '14px' } }, opposite: true },
    ],
    legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', y: 30, itemStyle: { color: COLORS.gray, fontSize: '16px' } },
    tooltip: { shared: true, valueDecimals: 2 },
    plotOptions: { series: { marker: { enabled: false } } },
    series: [
      { name: 'Precio de bolsa en períodos punta (COP/kWh)', type: 'spline', yAxis: 0, color: '#05d80a', data: s0 },
      { name: 'Precio marginal de escasez (COP/kWh)', type: 'spline', yAxis: 0, color: COLORS.yellow, dashStyle: 'ShortDash', data: s1 },
      { name: 'Nivel de embalse útil (%)', type: 'areaspline', yAxis: 1, color: COLORS.blue, fillOpacity: 0.2, data: s2 },
      { name: 'Senda de referencia (%)', type: 'spline', yAxis: 1, color: COLORS.down, dashStyle: 'Dot', data: s3 },
    ],
  }), [parsed]);
}

// ========================= Componente =========================
export default function Hidrologia() {
  const aportesOptions = useAportesOptionsFromHtml();
  const desabOptions = useDesabastecimientoOptionsFromHtml();

  return (
    <section className="space-y-6">
        {/* Banner */}
        <div
        className="rounded-2xl overflow-hidden h-24 md:h-28 lg:h-32 relative"
        style={{
            backgroundImage: `url(${bannerHidrologia})`, // ahora usa la imagen importada
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        >
        <div className="absolute inset-0 bg-black/30" />
        <h1 className="absolute left-6 top-1/2 -translate-y-1/2 text-white font-bold text-3xl md:text-4xl">
            Seguimiento Hidrológico
        </h1>
        </div>

      {/* ======== ÍNDICES (se mantiene) ======== */}
      <h2 className="text-lg text-gray-300">Índices</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
          <div className="text-gray-300 text-sm mb-2 flex items-center gap-3">
            <span className="font-semibold text-white">{indices[0].title}</span>
            <span className="text-xs text-gray-400">Actualizado: {indices[0].updated}</span>
          </div>

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

        {/* Card 2 */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
          <div className="text-gray-300 text-sm mb-2 flex items-center gap-3">
            <span className="font-semibold text-white">{indices[1].title}</span>
            <span className="text-xs text-gray-400">Actualizado: {indices[1].updated}</span>
          </div>
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
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
          <div className="text-gray-300 text-sm mb-4">
            <span className="font-semibold text-white">{indices[2].title}</span>
            <div className="text-xs text-gray-400">{indices[2].updated}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {indices[2].groups.map((g) => (
              <div key={g.name} className="rounded-lg border border-[#3a3a3a] p-3">
                <div className="text-yellow-400 font-semibold mb-1">{g.name}</div>
                <div className="text-white text-xl">{g.value}</div>
                <div className="text-gray-300 text-sm">{g.unit}</div>
                <div className="mt-2"><TrendChip dir={g.dir}>{g.delta}</TrendChip></div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-[#3a3a3a] p-3">
            <div className="text-white">{indices[2].bottom}</div>
            <div className="mt-2"><TrendChip dir={indices[2].bottomDir}>{indices[2].bottomDelta}</TrendChip></div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
          <div className="text-gray-300 text-sm mb-4">
            <span className="font-semibold text-white">{indices[3].title}</span>
            <div className="text-xs text-gray-400">{indices[3].updated}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {indices[3].groups.map((g) => (
              <div key={g.name} className="rounded-lg border border-[#3a3a3a] p-3">
                <div className="text-yellow-400 font-semibold whitespace-pre-line mb-1">{g.name}</div>
                <div className="text-white text-xl">{g.value}</div>
                <div className="text-gray-300 text-sm">{g.unit}</div>
                <div className="mt-2"><TrendChip dir={g.dir}>{g.delta}</TrendChip></div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-[#FFC800] text-[#111] px-3 py-1.5 rounded-md text-sm font-semibold">
              {indices[3].badge}
            </span>
            <span className="text-[#FFC800] font-semibold">{indices[3].badgeValue}</span>
          </div>
        </div>
      </div>

      {/* Mapa (placeholder) */}
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-2 md:p-3 lg:p-4">
        <div className="h-[520px] rounded-xl bg-[#1f1f1f] flex items-center justify-center text-gray-400 text-lg">
          Mapa embebido (pendiente de integración)
        </div>
      </div>

      {/* Tabla + Gráfica Aportes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
          <div className="text-white font-semibold mb-3">Región Hidrológica</div>
          <div className="overflow-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="text-gray-300 border-b border-[#3a3a3a]">
                <tr>
                  <th className="py-2">Región Hidrológica</th>
                  <th className="py-2">Embalses</th>
                  <th className="py-2">Volumen (%)</th>
                </tr>
              </thead>
              <tbody>
                {regiones.map((r) => (
                  <tr key={r.region} className="border-b border-[#2e2e2e]">
                    <td className="py-2">{r.region} <span className="text-yellow-400 ml-1">+</span></td>
                    <td className="py-2">{r.embalses}</td>
                    <td className="py-2">{r.volumen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfica Aportes (datos reales de Chart2) */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
          <HighchartsReact highcharts={Highcharts} options={useAportesOptionsFromHtml()} />
        </div>
      </div>

      {/* Estatuto de desabastecimiento (datos reales de Chart1) */}
      <div className="bg-[#262626] border border-[#3a3a3a] rounded-xl p-4">
        <HighchartsReact highcharts={Highcharts} options={useDesabastecimientoOptionsFromHtml()} />
      </div>
    </section>
  );
}


