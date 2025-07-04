import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';

// Inicializar módulos de Highcharts
Exporting(Highcharts);
OfflineExporting(Highcharts);
ExportData(Highcharts);
FullScreen(Highcharts);

export function CapacidadInstalada() {
  const chartRef = useRef(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/v1/graficas/6g_proyecto/acumulado_capacidad_proyectos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(r => r.json())
      .then(data => {
        // Ordenar por fecha
        const sorted = [...data].sort(
          (a, b) => new Date(a.fecha_entrada_operacion) - new Date(b.fecha_entrada_operacion)
        );

        // Detección dinámica de fuentes de energía
        const allFuentes = Object.keys(sorted[0]).filter(k => k !== 'fecha_entrada_operacion');

        const colorMap = {
          SOLAR: '#FFC800',
          EOLICA: '#5DFF97',
          VIENTO: '#FF9900',
          PCH: '#3B82F6',
          BIOMASA: '#B39FFF',
          'RAD SOLAR': '#FFC800'
        };

        // Crear series con datos [timestamp, valor]
        const series = allFuentes.map(fuente => {
          let lastValue = 0;
          const dataPoints = sorted.map(item => {
            const time = new Date(item.fecha_entrada_operacion).getTime();
            if (item[fuente] !== undefined) {
              lastValue = item[fuente];
            }
            return [time, lastValue];
          });
          return {
            name: fuente,
            data: dataPoints,
            color: colorMap[fuente] || '#666666'
          };
        });

        // Configuración de opciones de Highcharts
        setOptions({
          chart: {
            type: 'area',
            backgroundColor: '#262626',
            height: 450,
            marginBottom: 100
          },
          title: {
            text: 'Capacidad acumulada por tipo de proyecto',
            style: { fontFamily: 'Nunito Sans, sans-serif', fontSize: '16px' }
          },
          subtitle: { text: '', style: { color: '#AAA', fontSize: '12px' } },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%e %b %Y',
              month: '%b \'%y',
              year: '%Y'
            },
            labels: {
              rotation: -45,
              y: 18,
              style: {
                color: '#CCC',
                fontFamily: 'Nunito Sans, sans-serif',
                fontSize: '12px'
              }
            },
            title: { text: 'Fecha de entrada en operación', style: { color: '#FFF' } },
            lineColor: '#555',
            tickColor: '#888',
            tickLength: 5
          },
          yAxis: {
            min: 0,
            tickAmount: 6,
            gridLineDashStyle: 'Dash',
            gridLineColor: '#444',
            title: {
              text: 'Capacidad acumulada (MW)',
              style: { color: '#FFF' }
            },
            labels: {
              formatter() {
                return this.value.toLocaleString() + ' MW';
              },
              style: {
                color: '#CCC',
                fontFamily: 'Nunito Sans, sans-serif',
                fontSize: '12px'
              }
            }
          },
          tooltip: {
            backgroundColor: '#1F2937',
            style: { color: '#FFF', fontSize: '12px' },
            shared: true,
            formatter() {
              let s = `<b>Fecha: ${Highcharts.dateFormat('%e %b %Y', this.x)}</b>`;
              this.points.forEach(pt => {
                s += `<br/><span style=\"color:${pt.color}\">\u25CF</span> ${pt.series.name}: <b>${pt.y.toLocaleString()} MW</b>`;
              });
              return s;
            }
          },
          plotOptions: {
            area: {
              stacking: 'normal',
              marker: { enabled: false },
              lineWidth: 1
            }
          },
          series,
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            y: 25,
            itemStyle: { color: '#ccc', fontSize: '12px' },
            itemHoverStyle: { color: '#fff' }
          },
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
              }
            }
          }
        });

        // Forzar redraw tras carga
        setTimeout(() => chartRef.current?.chart?.redraw(), 200);
      })
      .catch(err => console.error('Error al cargar datos:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#262626] p-4 rounded border border-[#666666] shadow flex flex-col items-center justify-center h-64">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }} />
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }} />
        </div>
        <p className="text-gray-300 mt-4">Cargando capacidad instalada...</p>
      </div>
    );
  }

  if (!options) return null;

  return (
    <section className="mt-8">
      <div className="w-full bg-[#262626] p-4 rounded border border-[#666666] shadow relative">
        {/* Botón de ayuda superpuesto */}
        <button
          className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
          style={{ width: 30, height: 30 }}
          title="Ayuda"
          onClick={() => alert('Ok puedes mostrar ayuda contextual o abrir un modal.')}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
            <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
            <text
              x="12"
              y="18"
              textAnchor="middle"
              fontSize="16"
              fill="#fff"
              fontWeight="bold"
              fontFamily="Nunito Sans, sans-serif"
              pointerEvents="none"
            >?</text>
          </svg>
        </button>
        {/* Gráfica */}
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </div>
    </section>
  );
}

export default CapacidadInstalada;









