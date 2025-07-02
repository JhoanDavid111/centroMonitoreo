// src/components/GraficaCapacidadInstaladaTecnologia.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { API } from '../config/api';

export function GraficaCapacidadInstaladaTecnologia({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/v1/graficas/energia_electrica/grafica_capacidad_instalada_tecnologia`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // data: [{ fuente: "...", "2025-05": valor }, ...]
        const categories = data.map((d) => d.fuente);
        const valores = data.map((d) => {
          const key = Object.keys(d).find((k) => k !== 'fuente');
          return d[key];
        });

        setOptions({
          chart: { type: 'column', height: 350 },
          title: { text: 'Capacidad instalada por tecnología' },
          subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}` },
          xAxis: { categories, title: { text: 'Fuente' } },
          yAxis: { title: { text: 'Capacidad (GW)' } },
          series: [
            { name: 'Capacidad inst.', data: valores, color: '#FFC800' }
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
        setError('No fue posible cargar la gráfica de capacidad por tecnología.');
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
        <p className="text-gray-300 mt-4">Cargando gráfica de precios...</p>
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
  );
}

export default GraficaCapacidadInstaladaTecnologia;
