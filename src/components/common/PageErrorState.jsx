// src/components/common/PageErrorState.jsx
import React from 'react';

/**
 * Componente reutilizable para mostrar errores en páginas
 * 
 * @param {Object} props
 * @param {Error|string} props.error - Objeto Error o mensaje de error
 * @param {Function} props.onRetry - Función callback para reintentar (opcional)
 * @param {string} props.message - Mensaje personalizado (opcional)
 * @param {string} props.height - Altura del contenedor (opcional)
 */
export default function PageErrorState({ 
  error, 
  onRetry, 
  message,
  height = ''
}) {
  const errorMessage = error?.message || error || message || 'Ocurrió un error al cargar los datos';
  const displayMessage = message || errorMessage;

  return (
    <div className={`bg-[#262626] p-4 rounded-lg border border-gray-700 shadow flex flex-col items-center justify-center ${height}`}>
      <div className="flex flex-col items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-red-500 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <p className="text-red-500 text-center max-w-md mb-4">
          {displayMessage}
        </p>
        <button 
          onClick={onRetry || (() => window.location.reload())} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

