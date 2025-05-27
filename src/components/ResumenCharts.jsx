import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Carga módulos
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema oscuro global
Highcharts.setOptions({
  chart: {
    backgroundColor: '#111827',
    style: { fontFamily: 'sans-serif' }
  },
  title: { style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '8px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '8px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '10px' }
  }
});

export function ResumenCharts() {
  const [charts, setCharts] = useState([]);
  const [selected, setSelected] = useState('all');
  const chartRefs = useRef([]);

  useEffect(() => {
    const baseOptions = [
      // Donut 1: Distribución por tecnología
      {
        chart: { type: 'pie', height: 300 },
        title: { text: 'Distribución actual por tecnología' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        plotOptions: {
          pie: {
            innerSize: '60%',
            dataLabels: { enabled: true, format: '{point.name}: {point.y:.2f} MW' }
          }
        },
        series: [{
          name: 'Tecnología',
          data: [
            { name: 'Solar', y: 1960.05 },
            { name: 'Eólica', y: 120.06 }
          ]
        }],
        tooltip: { pointFormat: '{series.name}: <b>{point.y:.2f} MW</b>' }
      },
      // Donut 2: Distribución por categoría
      {
        chart: { type: 'pie', height: 300 },
        title: { text: 'Distribución actual por categoría' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        plotOptions: {
          pie: {
            innerSize: '60%',
            dataLabels: { enabled: true, format: '{point.name}: {point.y:.2f} MW' }
          }
        },
        series: [{
          name: 'Categoría',
          data: [
            { name: 'AG', y: 1960.05 },
            { name: 'GD', y: 120.06 }
          ]
        }],
        tooltip: { pointFormat: '{series.name}: <b>{point.y:.2f} MW</b>' }
      },
      // Barras 1: Proyectos próximos 6 meses
      {
        chart: { type: 'column', height: 350 },
        title: { text: 'Número de proyectos próximos 6 meses' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        xAxis: {
          categories: ['Junio','Julio','Agosto','Septiembre','Octubre','Noviembre'],
          title: { text: null }
        },
        yAxis: { title: { text: 'Número de proyectos' } },
        plotOptions: {
          column: { stacking: 'normal' }
        },
        series: [
          { name: 'Eólica', data: [0, 1, 0, 6, 6, 4], color: undefined },
          { name: 'Solar',  data: [1, 9, 15, 21, 22, 14], color: undefined }
        ]
      },
      // Barras 2: Histórico anual matriz completa
      {
        chart: { type: 'column', height: 350 },
        title: { text: 'Histórico anual matriz completa' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        xAxis: {
          categories: ['2020','2021','2022','2023','2024','2025','2026','2027','2028'],
          title: { text: null }
        },
        yAxis: { title: { text: 'Capacidad Instalada (GW)' } },
        plotOptions: {
          column: { stacking: 'normal' }
        },
        series: [
          { name: 'Solar',  data: [2.5, 2.7, 2.6, 2.8, 3.0, 3.5, 4.0, 5.5, 6.0] },
          { name: 'Eólica', data: [11, 12, 12.5, 13, 14, 15, 16, 17, 18] }
        ]
      }
    ];

    // Agregar export y fullscreen
    const withExport = baseOptions.map(opt => ({
      ...opt,
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
          }
        }
      }
    }));

    setCharts(withExport);
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
      <h2 className="text-2xl font-semibold mb-4 text-white">Gráficas Resumen</h2>

      {/* Dropdown externo */}
      <div className="mb-4">
        <select
          className="bg-gray-800 text-gray-200 p-2 rounded"
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

      {/* Grid dinámico */}
      <div className={`grid ${gridClasses} gap-4`}>
        {displayed.map(({ opt, idx }) => {
          const dynOpts = {
            ...opt,
            chart: {
              ...opt.chart,
              height: isFiltered ? 500 : opt.chart.height
            }
          };
          return (
            <div
              key={idx}
              className="bg-gray-900 p-4 rounded border border-gray-700 shadow relative"
            >
              {/* Botón maximizar */}
              <button
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
                onClick={() => chartRefs.current[idx].chart.fullscreen.toggle()}
                title="Maximizar gráfico"
              >⛶</button>

              <HighchartsReact
                highcharts={Highcharts}
                options={dynOpts}
                ref={el => (chartRefs.current[idx] = el)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}