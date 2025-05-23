import { Zap, BarChart, Flame, Wind } from 'lucide-react';

const indicadores = [
  {
    titulo: 'Demanda energía SIN',
    valor: '225.40 MWh',
    variacion: '+11.77%',
    icono: <Zap className="text-lime-400" size={28} />,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación hidráulica',
    valor: '177.38 MWh',
    variacion: '+11.77%',
    icono: <BarChart className="text-lime-400" size={28} />,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación térmica',
    valor: '19.95 MWh',
    variacion: '+11.77%',
    icono: <Flame className="text-lime-400" size={28} />,
    fecha: 'Actualizado el: 8/5/2025'
  },
  {
    titulo: 'Generación solar y eólica',
    valor: '9.94 MWh',
    variacion: '+11.77%',
    icono: <Wind className="text-lime-400" size={28} />,
    fecha: 'Actualizado el: 8/5/2025'
  }
];

export function IndicadoresResumen() {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Índices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicadores.map((i, idx) => (
          <div key={idx} className="bg-gray-900 p-4 rounded border border-gray-700 shadow">
            <div className="flex items-center mb-2 space-x-2">
              {i.icono}
              <h3 className="text-sm font-medium text-gray-300">{i.titulo}</h3>
            </div>
            <div className="text-xl font-semibold text-white">{i.valor}</div>
            <div className="text-xs text-gray-400 flex items-center space-x-2">
              <span className="bg-gray-800 px-2 py-0.5 rounded text-white text-[11px]">{i.variacion}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">{i.fecha}</div>
          </div>
        ))}
      </div>
    </section>
  );
}