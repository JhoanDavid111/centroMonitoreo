// src/components/IndicadoresEnergia.jsx
import React, { useEffect, useState } from 'react';

export function IndicadoresEnergia({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const [indicadores, setIndicadores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIndicadores() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://192.168.8.138:8002/v1/indicadores/energia_electrica', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
          })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setIndicadores(data);
      } catch (err) {
        console.error(err);
        setError('No fue posible cargar los indicadores.');
      } finally {
        setLoading(false);
      }
    }
    fetchIndicadores();
  }, [fechaInicio, fechaFin]);

  if (loading) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-gray-300">Cargando indicadores...</p>
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

  // indicadores ≈ { precio_escases: {...}, porcentaje_embalses: {...} }
  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-white font-sans">
        Indicadores Energía Eléctrica
      </h2>
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        {/* Precio de escasez */}
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-300">
            {indicadores.precio_escases.identificador}
          </h3>
          {indicadores.precio_escases.valor_1 !== null ? (
            <p className="text-xl text-white">
              {(indicadores.precio_escases.valor_1).toLocaleString()} {indicadores.precio_escases.unidad}
            </p>
          ) : (
            <p className="text-gray-400">Sin datos</p>
          )}
        </div>

        {/* Porcentaje embalse */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-300">
            {indicadores.porcentaje_embalses.identificador}
          </h3>
          <p className="text-xl text-white">
            {(indicadores.porcentaje_embalses.valor_1 * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-400">
            Cambio: { (indicadores.porcentaje_embalses.cambio_porcentual * 100).toFixed(2) }%
          </p>
        </div>
      </div>
    </section>
  );
}

export default IndicadoresEnergia;