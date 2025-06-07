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
    pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:.2f} MW</b><br/>'
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
        // 1) ordenar cronológicamente
        const sorted = [...data].sort(
          (a, b) => new Date(a.fecha_entrada_operacion) - new Date(b.fecha_entrada_operacion)
        );
        // 2) extraer fechas únicas (categorías)
        const categories = Array.from(new Set(
          sorted.map(item => item.fecha_entrada_operacion.slice(0,10))
        ));
        // 3) agrupar por fuente_energia
        const fuentes = Array.from(new Set(sorted.map(i => i.fuente_energia)));
        // 4) para cada fuente y cada fecha, sumar capacidad_acumulada
        const series = fuentes.map(fuente => {
          // map fecha -> suma
          const mapFecha = {};
          sorted.forEach(item => {
            if (item.fuente_energia === fuente) {
              const fecha = item.fecha_entrada_operacion.slice(0,10);
              mapFecha[fecha] = (mapFecha[fecha]||0) + item.capacidad_acumulada;
            }
          });
          // generar datos en orden de categories
          const dataF = categories.map(fecha => mapFecha[fecha] || 0);
          // asignar color según fuente
          const colorMap = {
            AGUA: '#87CEEB',
            BIOMASA: '#05D80A',
            'RAD SOLAR': '#FFD700',
            VIENTO: '#FF9900'
          };
          return {
            name: fuente,
            data: dataF,
            color: colorMap[fuente] || '#ccc'
          }
        });

        setOptions({
          chart: {
            type: 'area',
            height: 450,
            backgroundColor: '#262626'
          },
          title: { text: 'Capacidad acumulada por tipo de proyecto' },
          subtitle: { text: 'Fuente: API 6G Proyecto' },
          xAxis: {
            categories,
            title: {
              text: 'Fecha de entrada en operación',
              style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' }
            },
            tickInterval: Math.ceil(categories.length / 8),  // mostrar ~8 labels
            gridLineDashStyle: 'Dash'
          },
          yAxis: {
            title: {
              text: 'Capacidad acumulada (MW)',
              style: { color: '#ccc', fontFamily: 'Nunito Sans, sans-serif' }
            },
            min: 0,
            tickAmount: 6,            // alrededor de 6 líneas horizontales
            gridLineDashStyle: 'Dash'
          },
          plotOptions: {
            area: {
              stacking: 'normal',
              marker: { enabled: false },
              lineWidth: 1
            }
          },
          series,
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
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
      {/* contenedor a full width */}
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
