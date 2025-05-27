import React, { useState } from 'react'
import { Zap, Activity, Sun, Leaf } from 'lucide-react'

export function ComunidadesResumen() {
  const [expanded, setExpanded] = useState(false)

  // Datos de ejemplo para cada tarjeta
  const datosComunidades = [
    { icon: Zap, label: 'Comunidades instaladas', number: '4.500', value: '177,38 MW', updated: '8/5/2025' },
    { icon: Activity, label: 'Comunidades proyectadas', number: '4.500', value: '177,38 MW', updated: '8/5/2025' },
  ]
  const datosSolar = [
    { icon: Sun, label: 'Colombia Solar', number: '4.500', value: '177,38 MW', updated: '8/5/2025' },
    { icon: Leaf, label: 'Colombia Solar', number: '4.500', value: '177,38 MW', updated: '8/5/2025' },
  ]

  return (
    <div className="px-2 mb-8">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded transition"
        >
          Ver Comunidades energéticas y Colombia Solar
        </button>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sección Comunidades Energéticas */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Comunidades Energéticas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {datosComunidades.map((d, i) => {
                  const Icon = d.icon
                  return (
                    <div
                      key={i}
                      className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center mb-2">
                        <Icon className="text-yellow-400" size={20} />
                        <span className="ml-2 text-sm text-gray-300">{d.label}</span>
                      </div>
                      <div className="text-white font-bold text-xl">
                        No. {d.number} – {d.value}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Actualizado el: {d.updated}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sección Colombia Solar */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Colombia Solar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {datosSolar.map((d, i) => {
                  const Icon = d.icon
                  return (
                    <div
                      key={i}
                      className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center mb-2">
                        <Icon className="text-yellow-400" size={20} />
                        <span className="ml-2 text-sm text-gray-300">{d.label}</span>
                      </div>
                      <div className="text-white font-bold text-xl">
                        No. {d.number} – {d.value}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Actualizado el: {d.updated}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <button
            onClick={() => setExpanded(false)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded transition"
          >
            Ver menos
          </button>
        </div>
      )}
    </div>
  )
}