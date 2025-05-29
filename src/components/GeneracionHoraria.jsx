import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Cargar módulos de Highcharts
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
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px' }
  }
});

export function GeneracionHoraria() {
  const [charts, setCharts] = useState([]);
  const chartRefs = useRef([]);

  useEffect(() => {
    const horas = [
      '12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM',
      '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'
    ];

    // Datos ficticios para ambas gráficas
    const seriesBase = [
      { name: 'Solar', data: [22, 21, 20, 18, 15, 12, 10, 12, 18, 25, 28, 24] },
      { name: 'Eólica', data: [20, 19, 18, 16, 14, 11, 9, 11, 17, 23, 27, 23] },
      { name: 'Gas', data: [25, 24, 23, 21, 18, 14, 12, 15, 20, 30, 32, 26] }
    ];

    const options = [
      {
        title: { text: 'Generación horaria promedio 2022-1' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        chart: { height: 350 },
        xAxis: { categories: horas },
        yAxis: { title: { text: 'Generación / Demanda' } },
        series: seriesBase,
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
            }
          }
        }
      },
      {
        title: { text: 'Generación horaria promedio últimos 6 meses' },
        subtitle: { text: 'Fuente: XM. 2020-2024' },
        chart: { height: 350 },
        xAxis: { categories: horas },
        yAxis: { title: { text: 'Generación / Demanda' } },
        series: seriesBase.map(s => ({ ...s, data: s.data.map((v, i) => Math.max(v - 2, 0)) })),
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
            }
          }
        }
      }
    ];

    setCharts(options);
  }, []);

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((opt, idx) => (
          <div
            key={idx}
            className="bg-gray-900 p-4 rounded border border-gray-700 shadow relative"
          >
            {/* Botón maximizar full-screen */}
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
              onClick={() => chartRefs.current[idx].chart.fullscreen.toggle()}
              title="Maximizar gráfico"
            >⛶</button>
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
