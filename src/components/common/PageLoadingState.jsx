// src/components/common/PageLoadingState.jsx
import React from 'react';

/**
 * Componente reutilizable para mostrar estado de carga en páginas
 * 
 * @param {Object} props
 * @param {string} props.message - Mensaje personalizado (opcional)
 * @param {string} props.height - Altura del contenedor (opcional, default: 'h-64')
 */
export default function PageLoadingState({ 
  message = 'Cargando datos...', 
  height = 'h-64' 
}) {
  return (
    <div className={`bg-surface-primary p-4 rounded border border-gray-700 shadow flex flex-col items-center justify-center ${height}`}>
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

