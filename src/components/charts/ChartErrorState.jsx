// src/components/charts/ChartErrorState.jsx
// Componente reutilizable para mostrar estado de error en gráficas

export default function ChartErrorState({ error, onRetry = null }) {
  const errorMessage = error?.message || error || 'Error al cargar la gráfica.';
  
  return (
    <div className="bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center h-64">
      <div className="text-red-400 mb-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01M5.062 19h13.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.33 16c-.77 1.333.2 3 1.732 3z" 
          />
        </svg>
      </div>
      <p className="text-gray-300 text-center mb-4">{errorMessage}</p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

