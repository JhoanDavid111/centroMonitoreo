// src/components/IndicadoresEnergia.jsx
import React from 'react';
import { useIndicadoresEnergia } from '../services/indicadoresService';


export function IndicadoresEnergia({ fechaInicio = '2025-05-01', fechaFin = '2025-05-03' }) {
  const { data: indicadores, isLoading: loading, error } = useIndicadoresEnergia(
    { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  );

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
        <p className="text-gray-300">Cargando indicadores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#262626] p-4 rounded border border-gray-700 shadow">
        <p className="text-red-500">{error.message || 'No fue posible cargar los indicadores.'}</p>
      </div>
    );
  }

  if (!indicadores) return null;

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