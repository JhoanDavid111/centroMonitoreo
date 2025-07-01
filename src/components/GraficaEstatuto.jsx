// src/components/GraficaEstatuto.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';

export function GraficaEstatuto({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/v1/graficas/energia_electrica/grafica_estatuto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json(); // array de objetos

        const categories = data.map((d) => d.fecha);
        const dataVolumen = data.map((d) => d['Volumen útil del embalse']);
        const dataPrecioPunta = data.map((d) => d['Precio de Bolsa en Períodos Punta']);

        setOptions({
          chart: {
            zoomType: '',
            height: 350
          },
          title: {
            text: 'Volumen útil del embalse (diario)'
          },
          subtitle: {
            text: `Fuente: API. ${fechaInicio} → ${fechaFin}`
          },
          xAxis: {
            categories,
            title: { text: 'Fecha' }
          },
          yAxis: [
            {
              title: { text: 'Volumen útil (m³)' },
              opposite: false,
              labels: { style: { color: '#FFC800' } },
              gridLineColor: '#333333'
            },
            {
              title: { text: 'Precio Punta (COP)' },
              opposite: true,
              labels: { style: { color: '#00AEEF' } },
              gridLineColor: '#333333'
            }
          ],
          series: [
            {
              name: 'Volumen útil embalse',
              type: 'column',
              data: dataVolumen,
              yAxis: 0,
              color: '#FFC800'
            },
            {
              name: 'Precio Punta',
              type: 'line',
              data: dataPrecioPunta,
              yAxis: 1,
              color: '#00AEEF'
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
        setError('No fue posible cargar la gráfica de estatuto.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fechaInicio, fechaFin]);

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
      <p className="text-gray-300 mt-4">Cargando gráfica de estatuto...</p>
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

export default GraficaEstatuto;
