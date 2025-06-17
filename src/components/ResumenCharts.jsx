// src/components/ResumenCharts.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Carga de módulos
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
      // 1) Distribución por tecnología
      const techJson = await (await fetch(
        'http://192.168.8.138:8002/v1/graficas/6g_proyecto/capacidad_por_tecnologia',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      )).json();

      // 2) Distribución por categoría
      const catJson = await (await fetch(
        'http://192.168.8.138:8002/v1/graficas/6g_proyecto/capacidad_por_categoria',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      )).json();

      // 3) Histórico anual matriz completa
      const matJson = await (await fetch(
        'http://192.168.8.138:8002/v1/graficas/6g_proyecto/grafica_matriz_completa_anual',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      )).json();

      // Colores
      const techColor = {
      BIOMASA: '#05D80A',     // verde
      EOLICA:  '#1E90FF',     // azul
      PCH:     '#FFC800',     // amarillo
      SOLAR:   '#9C9C9C'      // gris claro
    };
      const catColor = {
      AGGE: 'orange',
      AGPE: '#17BECF',                         // celeste
      'Generacion Centralizada': '#9467BD',   // púrpura
      'Generacion Distribuida': '#FF7F0E'      // naranja fuerte
    };
      const matColor  = { BIOMASA: '#05d80a', HIDRÁULICA: '#4169E1', 'RAD SOLAR': '#9C9C9C', TÉRMICA: '#A52A2A' };

      const opts = [];

     // 1) Pie tecnología
    opts.push({
      chart: { type: 'pie', height: 300, backgroundColor: '#262626' },
      title: { text: 'Distribución actual por tecnología' },
      subtitle: { text: 'Fuente: API 6G Proyecto' },
      plotOptions: {
        pie: {
          innerSize: '60%',
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
      chart: { type: 'pie', height: 300, backgroundColor: '#262626' },
      title: { text: 'Distribución actual por categoría' },
      subtitle: { text: 'Fuente: API 6G Proyecto' },
      plotOptions: {
        pie: {
          innerSize: '60%',
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

      // 3) Column proyectos próximos 6 meses
      opts.push({
        chart: { type: 'column', height: 350, backgroundColor: '#262626' },
        title: { text: 'Número de proyectos próximos 6 meses' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        xAxis: {
          categories: ['Junio','Julio','Agosto','Septiembre','Octubre','Noviembre'],
          tickInterval: 1,
          labels: { style: { color: '#ccc', fontSize: '10px' } },
          title: { text: 'Mes', style: { color: '#ccc' } },
          gridLineColor: '#333'
        },
        yAxis: {
          title: { text: 'Número de proyectos', style: { color: '#ccc' } },
          labels: { style: { color: '#ccc', fontSize: '10px' } },
          tickAmount: 5,
          gridLineColor: '#333'
        },
        plotOptions: { column: { stacking: 'normal', borderWidth: 0 } },
        series: [
          { name: 'Eólica', data: [0,1,0,6,6,4], color: '#FFC800' },
          { name: 'Solar',  data: [1,9,15,21,22,14], color: '#FF9900' }
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

