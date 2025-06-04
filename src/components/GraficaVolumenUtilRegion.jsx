// src/components/GraficaVolumenUtilRegion.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export function GraficaVolumenUtilRegion({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://192.168.8.138:8002/v1/graficas/energia_electrica/grafica_volumen_util_region', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // data: [{ region: "...", "2025-05": número }, ...]
        const categories = data.map((d) => d.region);
        const valores = data.map((d) => {
          // Obtenemos la única clave distinta de "region"
          const key = Object.keys(d).find((k) => k !== 'region');
          return d[key];
        });

        setOptions({
          chart: { type: 'column', height: 350 },
          title: { text: 'Volumen útil por región (mes)' },
          subtitle: { text: `Fuente: API. ${fechaInicio} → ${fechaFin}` },
          xAxis: { categories, title: { text: 'Región' } },
          yAxis: { title: { text: 'Volumen (m³)' } },
          series: [
            { name: 'Volumen útil', data: valores, color: '#FFC800' }
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
        setError('No fue posible cargar la gráfica de volumen por región.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fechaInicio, fechaFin]);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-gray-300">Cargando gráfica de volumen por región...</p>
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
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
    </div>
  );
}

export default GraficaVolumenUtilRegion;
