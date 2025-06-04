// src/components/ListadoProyectosCurvaS.jsx
import React, { useEffect, useState } from 'react';

export function ListadoProyectosCurvaS() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProyectos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://192.168.8.138:8002/v1/graficas/6g_proyecto/listado_proyectos_curva_s', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
          // No requiere body según la descripción
        });
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
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
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

  return (
    <div className="overflow-x-auto bg-[#262626] p-4 rounded border border-gray-700 shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">Proyectos (Curva S)</h2>
      <table className="min-w-full divide-y divide-gray-700 text-sm text-white font-sans">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Nombre del Proyecto</th>
            <th className="px-3 py-2 text-left">Departamento</th>
            <th className="px-3 py-2 text-left">% Programado</th>
            <th className="px-3 py-2 text-left">% Real</th>
            <th className="px-3 py-2 text-left">FPO</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {proyectos.map((p, i) => (
            <tr key={i} className="hover:bg-gray-800">
              <td className="px-3 py-2">{p.id}</td>
              <td className="px-3 py-2">{p.nombre_del_proyecto.trim()}</td>
              <td className="px-3 py-2">{p.departamento}</td>
              <td className="px-3 py-2">
                {p.avance_porcentual_programado_porcentaje != null
                  ? `${p.avance_porcentual_programado_porcentaje}%`
                  : '-'}
              </td>
              <td className="px-3 py-2">
                {p.avance_porcentual_real_porcentaje != null
                  ? `${p.avance_porcentual_real_porcentaje}%`
                  : '-'}
              </td>
              <td className="px-3 py-2">
                {p.fecha_de_puesta_en_operacion_fpo
                  ? p.fecha_de_puesta_en_operacion_fpo.split('T')[0]
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListadoProyectosCurvaS;
