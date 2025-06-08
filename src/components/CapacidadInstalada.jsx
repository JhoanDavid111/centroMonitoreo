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

// Tema global
Highcharts.setOptions({
  chart: {
    backgroundColor: '#262626',
    style: { fontFamily: 'Nunito Sans, sans-serif' }
  },
  title: { style: { color: '#fff' } },
  subtitle: { style: { color: '#aaa' } },
  xAxis: {
    labels: { style: { color: '#ccc', fontSize: '10px' } },
    title: { style: { color: '#ccc' } },
    gridLineColor: '#333',
    gridLineDashStyle: 'Dash'
  },
  legend: {
    itemStyle: { color: '#ccc' },
    itemHoverStyle: { color: '#fff' },
    itemHiddenStyle: { color: '#666' }
  },
  tooltip: {
    backgroundColor: '#1f2937',
    style: { color: '#fff', fontSize: '12px' },
    shared: true
  }
});

export function CapacidadInstalada() {
  const chartRef = useRef(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    const cutoff = '2023-12-15';

    fetch('http://192.168.8.138:8002/v1/graficas/6g_proyecto/acumulado_capacidad_proyectos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort(
          (a, b) => new Date(a.fecha_entrada_operacion) - new Date(b.fecha_entrada_operacion)
        );

        const allDates = Array.from(new Set(
          sorted.map(item => item.fecha_entrada_operacion.slice(0, 10))
        ));
        const categories = allDates.filter(fecha => fecha >= cutoff);

        const fuentes = Array.from(new Set(sorted.map(i => i.fuente_energia)));
        const colorMap = {
          AGUA: '#87CEEB',
          BIOMASA: '#05D80A',
          'RAD SOLAR': '#FFD700',
          VIENTO: '#FF9900'
        };

        const series = fuentes.map(fuente => {
          const lastByDate = {};
          const nameByDate = {};
          sorted.forEach(item => {
            const fecha = item.fecha_entrada_operacion.slice(0, 10);
            if (item.fuente_energia === fuente && fecha >= cutoff) {
              lastByDate[fecha] = item.capacidad_acumulada;
              nameByDate[fecha] = item.nombre_proyecto;
            }
          });
          const dataPoints = categories.map(fecha => ({
            y: lastByDate[fecha] ?? 0,
            proyecto: nameByDate[fecha] ?? '—'
          }));
          return {
            name: fuente,
            data: dataPoints,
            color: colorMap[fuente] || '#666666'
          };
        });

        setOptions({
          chart: {
            type: 'area',
            height: 450,
            backgroundColor: '#262626',
            marginLeft: 80
          },
          title: { text: 'Capacidad acumulada por tipo de proyecto' },
          subtitle: { text: 'Fuente: API 6G Proyecto' },
          xAxis: {
            categories,
            title: { text: 'Fecha de entrada en operación' },
            tickInterval: 1,
            labels: { rotation: -45 }
          },
          yAxis: {
            min: 0,
            tickAmount: 6,
            title: {
              text: 'Capacidad acumulada (MW)',
              style: { color: '#ffffff', fontSize: '12px' }
            },
            labels: {
              enabled: true,
              style: { color: '#ffffff', fontSize: '10px' },
              formatter: function () {
                return this.value.toLocaleString() + ' MW';
              }
            },
            gridLineColor: '#444444',
            gridLineDashStyle: 'Dash'
          },
          tooltip: {
            formatter() {
              let s = `<b>Fecha: ${this.x}</b>`;
              this.points.forEach(pt => {
                s += `<br/><span style="color:${pt.color}">\u25CF</span> ${pt.series.name}: <b>${pt.y.toLocaleString()} MW</b>`;
                s += `<br/>&nbsp;&nbsp;<i>${pt.point.proyecto}</i>`;
              });
              return s;
            }
          },
          plotOptions: {
            area: { stacking: 'normal', marker: { enabled: false }, lineWidth: 1 }
          },
          series,
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
              }
            }
          }
        });

        setTimeout(() => {
          if (chartRef.current && chartRef.current.chart) {
            chartRef.current.chart.redraw();
          }
        }, 100);
      })
      .catch(err => console.error('Error al cargar datos:', err));
  }, []);

  if (!options) return null;

  return (
    <section className="mt-8">
      <div
        className="w-full bg-[#262626] p-4 rounded border border-[#666666] shadow relative"
        style={{ overflow: 'visible' }}
      >
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
          onClick={() => chartRef.current.chart.fullscreen.toggle()}
          title="Maximizar gráfico"
        >
          ⛶
        </button>
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </div>
    </section>
  );
}

export default CapacidadInstalada;




