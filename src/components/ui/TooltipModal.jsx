import React from 'react';


export default function TooltipModal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;

  return (
    // Fondo de la modal (oscuro y semi-transparente)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose} // Cierra al hacer clic fuera del contenido
    >
      {/* Contenedor del contenido (para detener la propagación del clic y evitar que cierre la modal) */}
      <div 
        className="bg-surface-primary rounded-xl p-6 w-11/12 max-w-lg shadow-2xl border border-[color:var(--border-default)] transition-all transform scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el contenido cierre la modal
      >
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-[color:var(--accent-primary)]">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Contenido */}
        <p className="text-text-muted text-base mb-6">
          {content}
        </p>

        {/* Botón de cierre */}
        {/* <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#FFC800] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#ffdf66] transition-colors shadow-md"
          >
            Entendido
          </button>
        </div> */}
      </div>
    </div>
  );
}
