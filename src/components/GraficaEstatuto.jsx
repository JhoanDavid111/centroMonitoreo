// src/components/GraficaEstatuto.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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
        const res = await fetch('http://192.168.8.138:8002/v1/graficas/energia_electrica/grafica_estatuto', {
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
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-gray-300">Cargando gráfica de estatuto...</p>
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

export default GraficaEstatuto;
