// src/components/CapacidadInstalada.jsx
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

// Tema global: fondo oscuro y Nunito Sans
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
  },
  title: { style: { color: '#fff', fontFamily: 'Nunito Sans, sans-serif' } },
  subtitle: { style: { color: '#aaa', fontFamily: 'Nunito Sans, sans-serif' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  yAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px', fontFamily: 'Nunito Sans, sans-serif' } },
    title: { style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' } },
    gridLineColor: '#333'
  },
  legend: {
    itemStyle: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px', fontFamily: 'Nunito Sans, sans-serif' },
    shared: true,
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.2f}</b><br/>'
  }
});

export function CapacidadInstalada() {
  const chartRef = useRef(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    fetch('http://192.168.8.138:8002/v1/graficas/6g_proyecto/acumulado_capacidad_proyectos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort(
          (a, b) =>
            new Date(a.fecha_entrada_operacion) -
            new Date(b.fecha_entrada_operacion)
        );
        const categories = sorted.map(item => {
          const d = new Date(item.fecha_entrada_operacion);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
            d.getDate()
          ).padStart(2, '0')}`;
        });
        const series = [
          {
            name: 'Capacidad instalada  (MW)',
            data: sorted.map(item => item.capacidad_acumulada),
            color: '#FFC800'
          }
        ];

        setOptions({
          chart: { type: 'area', height: 400, backgroundColor: '#262626' },
          title: { text: 'Capacidad Instalada de proyectos' },
          subtitle: { text: 'Fuente: API 6G Proyecto' },
          xAxis: {
            categories,
            title: {
              text: 'Fecha de puesta en operación',
              style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' }
            }
          },
          yAxis: {
            title: {
              text: 'Capacidad instalada (MW)',
              style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' }
            },
            min: 0,
            gridLineColor: '#333'
          },
          plotOptions: {
            area: { stacking: 'normal', marker: { enabled: false } }
          },
          series,
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: [
                  'downloadPNG',
                  'downloadJPEG',
                  'downloadPDF',
                  'downloadSVG'
                ]
              }
            }
          }
        });
      })
      .catch(err => console.error('Error al cargar datos:', err));
  }, []);

  if (!options) return null;

  return (
    <section className="mt-8">
      {/* Contenedor al 100% de ancho */}
      <div className="w-full bg-[#262626] p-4 rounded border border-[#666666] shadow relative">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          onClick={() => chartRef.current.chart.fullscreen.toggle()}
          title="Maximizar gráfico"
        >
          ⛶
        </button>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>
    </section>
  );
}

export default CapacidadInstalada;
