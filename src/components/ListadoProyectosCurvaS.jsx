// src/components/ListadoProyectosCurvaS.jsx
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export function ListadoProyectosCurvaS() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProyectos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          'http://192.168.8.138:8002/v1/graficas/6g_proyecto/listado_proyectos_curva_s',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProyectos(data);
      } catch (err) {
        console.error(err);
        setError('No fue posible cargar el listado de proyectos para curva S.');
      } finally {
        setLoading(false);
      }
    }
    fetchProyectos();
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
        <p className="text-gray-300">Cargando listado de proyectos...</p>
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

  // Preparar opciones para la curva S
  const chartOptions = {
    chart: {
      type: 'spline',
      backgroundColor: '#262626',
      plotBorderColor: '#444',
      plotBorderWidth: 1
    },
    title: {
      text: 'Curva S de Proyectos',
      style: { color: '#fff', fontSize: '20px' }
    },
    xAxis: {
      categories: proyectos.map(p => p.id),
      title: { text: 'ID del Proyecto', style: { color: '#ccc' } },
      labels: { style: { color: '#ccc' } },
      gridLineColor: '#444'
    },
    yAxis: {
      title: { text: '% de Avance', style: { color: '#ccc' } },
      labels: { style: { color: '#ccc' } },
      gridLineColor: '#444',
      max: 100,
      min: 0
    },
    series: [
      {
        name: '% Avance',
        data: proyectos.map(p =>
          p.porcentaje_avance != null ? p.porcentaje_avance : 0
        ),
        marker: { enabled: true }
      }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: '#ccc' } }
  };

  return (
    <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">Proyectos (Curva S)</h2>

      {/* Gráfica Curva S */}
      <div className="mb-6 relative">
        <button
        className="absolute top-[10px] right-[45px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors"
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
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      {/* Tabla de Proyectos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 text-sm text-white font-sans">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-left">Tecnología</th>
              <th className="px-3 py-2 text-left">Ciclo</th>
              <th className="px-3 py-2 text-left">Promotor</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Capacidad (MW)</th>
              <th className="px-3 py-2 text-left">Departamento</th>
              <th className="px-3 py-2 text-left">Municipio</th>
              <th className="px-3 py-2 text-left">FPO</th>
              <th className="px-3 py-2 text-left">% Avance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {proyectos.map((p, i) => (
              <tr key={i} className="hover:bg-gray-800">
                <td className="px-3 py-2">{p.id}</td>
                <td className="px-3 py-2">{p.nombre_proyecto}</td>
                <td className="px-3 py-2">{p.tipo_proyecto}</td>
                <td className="px-3 py-2">{p.tecnologia}</td>
                <td className="px-3 py-2">{p.ciclo_asignacion}</td>
                <td className="px-3 py-2">{p.promotor}</td>
                <td className="px-3 py-2">{p.estado_proyecto}</td>
                <td className="px-3 py-2">{p.capacidad_instalada_mw}</td>
                <td className="px-3 py-2">{p.departamento}</td>
                <td className="px-3 py-2">{p.municipio || '-'}</td>
                <td className="px-3 py-2">
                  {p.fpo ? p.fpo.split('T')[0] : '-'}
                </td>
                <td className="px-3 py-2">
                  {p.porcentaje_avance != null
                    ? `${p.porcentaje_avance}%`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListadoProyectosCurvaS;
