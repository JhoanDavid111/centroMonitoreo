// src/components/charts/ChartLoadingState.jsx
// Componente reutilizable para mostrar estado de carga en gráficas

export default function ChartLoadingState({ message = 'Cargando gráfica...' }) {
  return (
    <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-64">
      <div className="flex space-x-2">
        <div 
          className="w-3 h-3 rounded-full animate-bounce" 
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0s' }} 
        />
        <div 
          className="w-3 h-3 rounded-full animate-bounce" 
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.2s' }} 
        />
        <div 
          className="w-3 h-3 rounded-full animate-bounce" 
          style={{ backgroundColor: 'rgba(255,200,0,1)', animationDelay: '0.4s' }} 
        />
      </div>
      <p className="text-gray-300 mt-4">{message}</p>
    </div>
  );
}

