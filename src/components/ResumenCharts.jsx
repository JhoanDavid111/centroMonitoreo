
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';


Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema oscuro y Nunito Sans
Highcharts.setOptions({
  chart: { backgroundColor: '#262626', style: { fontFamily: 'Nunito Sans, sans-serif' } },
  title: { style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#262626',
    style: { color: '#fff', fontSize: '12px' }
  }
});

export function ResumenCharts() {
  const [charts, setCharts] = useState([]);
  const [selected, setSelected] = useState('all');
  const chartRefs = useRef([]);

  useEffect(() => {
    async function fetchData() {
      const techJson = await (await fetch(
        'http://192.168.8.138:8002/v1/graficas/6g_proyecto/capacidad_por_tecnologia',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      )).json();

      const catJson = await (await fetch(
        'http://192.168.8.138:8002/v1/graficas/6g_proyecto/capacidad_por_categoria',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      )).json();

      const entradaJson = await (await fetch(
        'http://192.168.8.138:8002/v1/graficas/6g_proyecto/capacidad_por_entrar_075',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      )).json();

      const matJson = await (await fetch(
        'http://192.168.8.138:8002/v1/graficas/6g_proyecto/grafica_matriz_completa_anual',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      )).json();

      const techColor = {
        BIOMASA: '#D3DF1E',
        EOLICA: '#2CA02C',
        PCH: '#1F77B4',
        SOLAR: '#FFC800'
      };

      const catColor = {
        AGGE: '#D3DF1E',
        AGPE: '#2CA02C',
        'Generacion Centralizada': '#1F77B4',
        'Generacion Distribuida': '#FFC800'
      };

      const matColor = {
        BIOMASA: '#05D80A',
        HIDRÁULICA: '#4169E1',
        'RAD SOLAR': '#9C9C9C',
        TÉRMICA: '#A52A2A'
      };

      const colorEntrada = {
        'BIOMASA Y RESIDUOS': '#9467BD',
        'EÓLICA': '#2CA02C',
        'PCH': '#1F77B4',
        'SOLAR FV': '#FFC800'
      };

      const opts = [];

      // 1) Pie tecnología
      opts.push({
        chart: { type: 'pie', height: 500, backgroundColor: '#262626' },
        title: { text: 'Distribución actual por tecnología' },
        subtitle: { text: 'Fuente: API 6G Proyecto' },
        plotOptions: {
          pie: {
            innerSize: 0,
            dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y:.2f} MW' },
            showInLegend: true
          }
        },
        series: [{
          name: 'Tecnología',
          colorByPoint: false,
          data: techJson.map(d => ({
            name: d.tipo_tecnologia,
            y: d.capacidad_mw,
            color: techColor[d.tipo_tecnologia] || '#666666'
          }))
        }],
        tooltip: { pointFormat: '{series.name}: <b>{point.y:.2f} MW</b>' },
        exporting: { enabled: true }
      });

      // 2) Pie categoría
      opts.push({
        chart: { type: 'pie', height: 500, backgroundColor: '#262626' },
        title: { text: 'Distribución de Capacidad Instalada por Tipo de Proyecto' },
        subtitle: { text: 'Fuente: API 6G Proyecto' },
        plotOptions: {
          pie: {
            innerSize: 0,
            dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y:.2f} MW' },
            showInLegend: true
          }
        },
        series: [{
          name: 'Categoría',
          colorByPoint: false,
          data: catJson.map(d => ({
            name: d.tipo_proyecto,
            y: d.capacidad_mw,
            color: catColor[d.tipo_proyecto] || '#666666'
          }))
        }],
        tooltip: { pointFormat: '{series.name}: <b>{point.y:.2f} MW</b>' },
        exporting: { enabled: true }
      });

      // 3) Capacidad Entrante por mes
      const meses = entradaJson.map(item => item.mes);
      const tecnologias = Object.keys(entradaJson[0]).filter(k => k !== 'mes');

      const seriesData = tecnologias.map(tec => ({
        name: tec,
        data: entradaJson.map(mes => mes[tec] || 0),
        color: colorEntrada[tec] || '#666666'
      }));

      const totalPorMes = entradaJson.map((item, idx) => {
        const total = tecnologias.reduce((sum, tec) => sum + (item[tec] || 0), 0);
        return {
          x: idx,
          y: total,
          dataLabels: {
            enabled: true,
            format: '{y:.1f}',
            style: { color: '#fff', textOutline: 'none', fontWeight: 'bold' },
            verticalAlign: 'bottom'
          },
          color: 'transparent' // No visible
        };
      });

      opts.push({
        chart: { type: 'column', height: 350, backgroundColor: '#262626' },
        title: { text: 'Capacidad Entrante por mes' },
        subtitle: { text: 'Fuente: API 6G Proyecto' },
        xAxis: {
          categories: meses,           
          tickInterval: 1,             
          title: {
            text: 'Mes',
            style: { color: '#ccc' }
          },
          labels: {
            style: { color: '#ccc', fontSize: '10px' },
            step: 1,                  
            rotation: -45,             
            autoRotation: false       
          },
          gridLineColor: '#333'
        },
        yAxis: {
          title: { text: 'Capacidad (MW)', style: { color: '#ccc' } },
          labels: { style: { color: '#ccc', fontSize: '10px' } },
          tickAmount: 5,
          gridLineColor: '#333'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            borderWidth: 0,
            dataLabels: { enabled: false }
          }
        },
        series: [
          ...seriesData,
          {
            name: 'Total',
            type: 'scatter',
            marker: { enabled: false },
            data: totalPorMes,
            enableMouseTracking: false
          }
        ],
        exporting: { enabled: true }
      });

      // 4) Column histórico anual matriz completa
      const years = Object.keys(matJson[0]).filter(k => k !== 'fuente');
      opts.push({
        chart: { type: 'column', height: 350, backgroundColor: '#262626' },
        title: { text: 'Histórico anual matriz completa' },
        subtitle: { text: 'Fuente: API 6G Proyecto' },
        xAxis: {
          categories: years,
          tickInterval: 1,
          labels: { style: { color: '#ccc', fontSize: '10px' } },
          title: { text: 'Año', style: { color: '#ccc' } },
          gridLineColor: '#333'
        },
        yAxis: {
          title: { text: 'Capacidad Instalada (GW)', style: { color: '#ccc' } },
          labels: { style: { color: '#ccc', fontSize: '10px' } },
          tickAmount: 6,
          gridLineColor: '#333'
        },
        plotOptions: { column: { stacking: 'normal', borderWidth: 0 } },
        series: matJson.map(row => ({
          name: row.fuente,
          data: years.map(y => row[y] ?? 0),
          color: matColor[row.fuente] || '#666666'
        })),
        exporting: { enabled: true }
      });

      setCharts(opts);
    }

    fetchData().catch(console.error);
  }, []);

  const isFiltered = selected !== 'all';
  const gridClasses = isFiltered
    ? 'grid-cols-1 lg:grid-cols-1'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
  const displayed = charts
    .map((opt, idx) => ({ opt, idx }))
    .filter(item => selected === 'all' || String(item.idx) === selected);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-white font-sans">
        Gráficas Resumen
      </h2>

      <div className="mb-4">
        <select
          className="bg-[#262626] text-gray-200 p-2 rounded"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="all">Mostrar todos</option>
          {charts.map((c, i) => (
            <option key={i} value={String(i)}>
              {c.title.text}
            </option>
          ))}
        </select>
      </div>

      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => (
          <div
            key={idx}
            className="bg-[#262626] p-4 rounded border border-[#666666] shadow relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
              onClick={() => chartRefs.current[idx].chart.fullscreen.toggle()}
              title="Maximizar gráfico"
            >
              ⛶
            </button>
            <HighchartsReact
              highcharts={Highcharts}
              options={opt}
              ref={el => (chartRefs.current[idx] = el)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ResumenCharts;




