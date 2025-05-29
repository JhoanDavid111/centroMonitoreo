import React from 'react'
import { Zap, BarChart, Flame, Wind } from 'lucide-react'

const indicadores = [
  {
    titulo: 'Demanda energía SIN',
    valor: '225.40 MWh',
    variacion: '+11.77%',
    icono: <Zap className="text-[#FFC800]" size={28} />,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación hidráulica',
    valor: '177.38 MWh',
    variacion: '+11.77%',
    icono: <BarChart className="text-[#FFC800]" size={28} />,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación térmica',
    valor: '19.95 MWh',
    variacion: '+11.77%',
    icono: <Flame className="text-[#FFC800]" size={28} />,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación solar y eólica',
    valor: '9.94 MWh',
    variacion: '+11.77%',
    icono: <Wind className="text-[#FFC800]" size={28} />,
    fecha: 'Actualizado el: 8/5/2025'
  }
]

export function IndicadoresResumen() {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Índices</h2>

      {/* Grid responsiva */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicadores.map((i, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 p-5 bg-[#262626] border border-[#575756] rounded-lg"
          >
            <div className="flex items-start gap-3">
              {i.icono}
              <h3 className="text-[18px] font-normal leading-[26px] text-[#B0B0B0] font-sans">
                {i.titulo}
              </h3>
            </div>

            <div className="text-xl font-semibold text-white">
              {i.valor}
            </div>

            <div className="bg-[262626]] px-2 py-0.5 rounded text-white text-[11px] font-medium">
              {i.variacion}
            </div>

            <div className="text-xs text-gray-500">
              {i.fecha}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}