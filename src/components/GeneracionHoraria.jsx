// src/components/GeneracionHoraria.jsx
import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';

// Carga de módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

// Tema global con fondo oscuro y fuente Nunito Sans
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
  },
  title: { style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
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
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);

  useEffect(() => {
    // Generar etiquetas de 1 a 24
    const horas = Array.from({ length: 24 }, (_, i) => String(i + 1));

    // Datos base
    const termica    = [55079,52470,50415,48561,47257,46422,45386,43938,44225,44438,45049,46039,46987,47923,49072,50459,52044,54726,57733,59866,60445,59406,58990,57756];
    const eolica     = termica.map(v => Math.round(v * 0.15));
    const cogenerador= termica.map(v => Math.round(v * 0.18));
    const hidraulica = termica.map(v => Math.round(v * 1.2));
    const solar      = termica.map(v => Math.round(v * 0.02));

    const baseOptions = {
      chart: {
        type: 'area',
        height: 350,
        backgroundColor: '#262626'
      },
      title: {
        text: 'Curva de Generación por Tecnología'
      },
      xAxis: {
        categories: horas,
        tickInterval: 1,
        title: {
          text: 'Hora del día',
          style: { color: '#ccc' }
        },
        labels: {
          style: { color: '#ccc', fontSize: '10px' }
        },
        gridLineColor: '#333'
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Generación (kWh)',
          style: { color: '#ccc' }
        },
        labels: {
          style: { color: '#ccc', fontSize: '10px' }
        },
        gridLineColor: '#333'
      },
      tooltip: {
        shared: true,
        pointFormat:
          '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineWidth: 1,
          marker: { enabled: false }
        }
      },
      legend: {
        itemStyle: { color: '#ccc' },
        itemHoverStyle: { color: '#fff' },
        itemHiddenStyle: { color: '#666' }
      },
      series: [
        { name: 'SOLAR',       data: solar,       color: '#FFD700' },
        { name: 'EÓLICA',      data: eolica,      color: '#87CEEB' },
        { name: 'COGENERADOR', data: cogenerador, color: '#808080' },
        { name: 'HIDRÁULICA',  data: hidraulica,  color: '#4169E1' },
        { name: 'TÉRMICA',     data: termica,     color: '#A52A2A' }
      ],
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
          }
        }
      },
      responsive: {
        rules: [{
          condition: { maxWidth: 600 },
          chartOptions: {
            legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' }
          }
        }]
      }
    };

    // Variante con ligeros ajustes en datos para el segundo gráfico
    const variantOptions = {
      ...baseOptions,
      title: { text: 'Curva de Generación Variante' },
      series: baseOptions.series.map(s => ({
        ...s,
        data: s.data.map(v => Math.round(v * (s.name === 'SOLAR' ? 1.5 : 0.8)))
      }))
    };

    // Aplicar a ambos charts
    if (chartRef1.current) chartRef1.current.chart.update(baseOptions, true, true);
    if (chartRef2.current) chartRef2.current.chart.update(variantOptions, true, true);
  }, []);

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico original */}
        <div className="bg-[#262626] p-4 rounded border border-[#666666] shadow relative">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={() => chartRef1.current.chart.fullscreen.toggle()}
            title="Maximizar gráfico"
          >⛶</button>
          <HighchartsReact highcharts={Highcharts} options={{}} ref={chartRef1} />
        </div>
        {/* Gráfico variante */}
        <div className="bg-[#262626] p-4 rounded border border-[#666666] shadow relative">
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={() => chartRef2.current.chart.fullscreen.toggle()}
            title="Maximizar gráfico"
          >⛶</button>
          <HighchartsReact highcharts={Highcharts} options={{}} ref={chartRef2} />
        </div>
      </div>
    </section>
  );
}

export default GeneracionHoraria;


