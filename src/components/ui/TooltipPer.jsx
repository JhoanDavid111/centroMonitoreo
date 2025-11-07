
// src/components/ui/TooltipPer.jsx
import React, { useState } from 'react';

export const TooltipPer = ({
  children,
  tooltip,
  className = '',
  tooltipClass = '',
  placement = 'top',
  offsetX = 0, // Nuevo: ajuste horizontal personalizable
  offsetY = 0, // Nuevo: ajuste vertical personalizable
  maxWidth = 'max-w-xs', // Nuevo: ancho máximo configurable
  align = 'center' // Nuevo: alineación (left, center, right)
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Calcular clases de alineación
  const getAlignmentClasses = () => {
    switch (align) {
      case 'left':
        return 'left-0 translate-x-0';
      case 'right':
        return 'right-0 translate-x-0';
      case 'center':
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute z-50
            bg-gray-800 text-white text-xs rounded p-2
            shadow-soft ${maxWidth}
            ${placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            ${getAlignmentClasses()}
            ${tooltipClass}
          `}
          style={{
            minWidth: 'max-content',
            transform: `translate(${offsetX}px, ${offsetY}px) ${align === 'center' ? 'translateX(-50%)' : ''}`,
            whiteSpace: 'normal', // Permite múltiples líneas si es necesario
            wordWrap: 'break-word' // Asegura que texto largo no desborde
          }}
        >
          {tooltip}
          {/* Flecha del tooltip */}
          <div 
            className="absolute w-2 h-2 bg-gray-800 rotate-45"
            style={{
              bottom: placement === 'top' ? '-4px' : 'auto',
              top: placement !== 'top' ? '-4px' : 'auto',
              left: align === 'center' ? '50%' : 
                     align === 'left' ? '10px' : 'calc(100% - 18px)',
              marginLeft: align === 'center' ? '-4px' : '0'
            }}
          ></div>
        </div>
      )}
    </div>
  );
};