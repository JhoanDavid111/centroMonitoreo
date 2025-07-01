// src/components/GraficaDemanda.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export function GraficaDemanda({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://192.168.8.138:8002/v1/graficas/energia_electrica/grafica_demanda', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const categories = data.map((d) => d.fecha);
        const dataDemCom = data.map((d) => d['Demanda Comercial por Sistema']);
        const dataEnerFirm = data.map((d) => d['Energía en Firme Cargo por Confiabilidad']);
        const dataObligOEF = data.map((d) => d['Obligación de Energía en Firme']);

        setOptions({
          chart: { type: 'line', height: 350 },
          title: { text: 'Demanda vs Energía en Firme' },
          subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}` },
          xAxis: { categories, title: { text: 'Fecha' } },
          yAxis: { title: { text: 'Cantidad' } },
          series: [
            { name: 'Demanda Comercial', data: dataDemCom, color: '#FFC800' },
            { name: 'Energía en Firme', data: dataEnerFirm, color: '#4CAF50' },
            { name: 'Obligación Energía Firme', data: dataObligOEF, color: '#D4AF37' }
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
        setError('No fue posible cargar la gráfica de demanda.');
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
      <p className="text-gray-300 mt-4">Cargando gráfica de demanda...</p>
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
      {/* Botón de ayuda */}
      <button
        className="absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
        style={{ width: 30, height: 30 }}
        title="Ayuda"
        onClick={() => alert('Ok Aquí puedes mostrar ayuda contextual o abrir un modal.')}
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
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
}

export default GraficaDemanda;
