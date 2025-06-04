// src/components/GraficaAcumuladoCapacidadProyectos.jsx
import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export function GraficaAcumuladoCapacidadProyectos() {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://192.168.8.138:8002/v1/graficas/6g_proyecto/acumulado_capacidad_proyectos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
          // No requiere body
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // data: [{ nombre_proyecto, fecha_finalizacion, capacidad_acumulada, tipo_proyecto_fuente, numero_proyectos }, ...]
        // Agrupamos por tipo_proyecto_fuente
        const fuentesMap = {};
        data.forEach((d) => {
          if (!fuentesMap[d.tipo_proyecto_fuente]) {
            fuentesMap[d.tipo_proyecto_fuente] = { acumulado: 0, cantidad: 0 };
          }
          fuentesMap[d.tipo_proyecto_fuente].acumulado += d.capacidad_acumulada;
          fuentesMap[d.tipo_proyecto_fuente].cantidad += d.numero_proyectos;
        });
        const categories = Object.keys(fuentesMap);
        const dataAcumulado = categories.map((f) => fuentesMap[f].acumulado);
        const dataNumProyectos = categories.map((f) => fuentesMap[f].cantidad);

        setOptions({
          chart: { type: 'column', height: 350 },
          title: { text: 'Capacidad acumulada / No. de proyectos por fuente' },
          subtitle: { text: 'Fuente: API. Sin rango (todos los proyectos)' },
          xAxis: { categories, title: { text: 'Tipo de proyecto / Fuente' } },
          yAxis: [
            {
              title: { text: 'Capacidad acumulada (MW)' },
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
              name: 'Capacidad acumulada (MW)',
              data: dataAcumulado,
              type: 'column',
              yAxis: 0,
              color: '#FFC800'
            },
            {
              name: 'Número de proyectos',
              data: dataNumProyectos,
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
        setError('No fue posible cargar la gráfica de acumulado de capacidad.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-gray-300">Cargando gráfica de acumulado de capacidad...</p>
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

export default GraficaAcumuladoCapacidadProyectos;
