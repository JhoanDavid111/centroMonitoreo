// src/components/GraficaPrecios.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export function GraficaPrecios({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://192.168.8.138:8002/v1/graficas/energia_electrica/grafica_precios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json(); // Array de objetos
        // Extraer categorías (fechas):
        const categories = data.map((d) => d.fecha);

        // Extraer series:
        const dataMin = data.map((d) => d['Precio Bolsa Minimo Horario']);
        const dataAvg = data.map((d) => d['Precio Bolsa Promedio Horario']);
        const dataMax = data.map((d) => d['Precio Bolsa Máximo Horario']);

        setOptions({
          chart: {
            type: 'line',
            height: 350
          },
          title: {
            text: 'Precios de Bolsa (horario)'
          },
          subtitle: {
            text: `Fuente: API. ${fechaInicio} → ${fechaFin}`
          },
          xAxis: {
            categories,
            title: { text: 'Fecha' }
          },
          yAxis: {
            title: { text: 'Precio (COP)' }
          },
          series: [
            {
              name: 'Mínimo',
              data: dataMin,
              color: '#00AEEF'
            },
            {
              name: 'Promedio',
              data: dataAvg,
              color: '#FFC800'
            },
            {
              name: 'Máximo',
              data: dataMax,
              color: '#D4AF37'
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
        setError('No fue posible cargar la gráfica de precios.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fechaInicio, fechaFin]);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-gray-300">Cargando gráfica de precios...</p>
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

export default GraficaPrecios;