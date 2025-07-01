// src/components/GraficaCapacidadPorcentajeAvanceCurvaS.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export function GraficaCapacidadPorcentajeAvanceCurvaS() {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://192.168.8.138:8002/v1/graficas/6g_proyecto/grafica_capacidad_porcentaje_avance_curva_s', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
          // No requiere body, según tu descripción
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // data: [{ porcentaje_de_avance: "...", suma_capacidad, numero_proyectos }, ...]
        const categories = data.map((d) => d.porcentaje_de_avance);
        const dataCapacidad = data.map((d) => d.suma_capacidad);
        const dataProyectos = data.map((d) => d.numero_proyectos);

        setOptions({
          chart: { type: 'column', height: 350 },
          title: { text: 'Capacidad instalada vs % de avance' },
          subtitle: { text: 'Fuente: XM. 2020-2024' },
          xAxis: {
            categories,
            title: { text: 'Porcentaje de avance' }
          },
          yAxis: [
            {
              title: { text: 'Capacidad instalada (MW)' },
              labels: { style: { color: '#FFC800' } },
              gridLineColor: '#333333'
            },
            {
              title: { text: 'Número de proyectos' },
              opposite: true,
              labels: { style: { color: '#4CAF50' } },
              gridLineColor: '#333333'
            }
          ],
          series: [
            {
              name: 'Capacidad instalada',
              data: dataCapacidad,
              type: 'column',
              yAxis: 0,
              color: '#FFC800'
            },
            {
              name: 'Número de proyectos',
              data: dataProyectos,
              type: 'line',
              yAxis: 1,
              color: '#4CAF50'
            }
          ],
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG','downloadJPEG','downloadPDF','downloadSVG']
              }
            }
          }
        });
      } catch (err) {
        console.error(err);
        setError('No fue posible cargar la gráfica de curva S (capacidad vs porcentaje).');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center h-64">
      <div className="flex space-x-2">
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }}
        ></div>
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }}
        ></div>
        <div
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }}
        ></div>
      </div>
        <p className="text-gray-300">Cargando gráfica de curva S (capacidad vs avance)...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow relative">
      {/* Botón de ayuda superpuesto */}
      <button
        className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
        style={{ width: 30, height: 30 }}
        title="Ayuda"
        onClick={() => alert('Ok puedes mostrar ayuda contextual o abrir un modal.')}
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="rounded-full"
        >
          <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
          <text
            x="12"
            y="16"
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
  );
}

export default GraficaCapacidadPorcentajeAvanceCurvaS;
