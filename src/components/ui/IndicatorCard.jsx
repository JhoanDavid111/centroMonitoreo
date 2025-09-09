// src/components/ui/IndicatorCard.jsx

import { HelpCircle } from 'lucide-react';
import React from 'react';

export default function IndicatorCard({ 
  icon, 
  label, 
  value, 
  updated, 
  hint,             // opcional
  showHelp = false, // opcional
  className = ''    // opcional
}) {
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString('es-CO') 
    : value;

  // Normalizamos tamaño del ícono si viene como prop
  const normalizedIcon = icon 
    ? React.cloneElement(icon, { 
        className: "h-5 w-5 flex-shrink-0"  // Tamaño consistente para todos los íconos
      })
    : null;

  return (
    <div className={`bg-[#262626] p-5 rounded-lg border border-[#666666] shadow ${className}`}>
      {/* Header - Corregido para alineación vertical */}
      <div className="flex items-start gap-2 mb-2">
        <div className="flex items-center gap-2 flex-grow min-h-[24px]">
          {normalizedIcon && (
            <div className="flex items-center justify-center h-5 w-5 flex-shrink-0">
              {normalizedIcon}
            </div>
          )}
          <span className="text-sm sm:text-base md:text-lg font-normal text-[#B0B0B0] leading-tight align-middle">
            {label}
          </span>
        </div>
        {showHelp && (
          <HelpCircle
            className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 rounded h-5 w-5 p-1 flex-shrink-0 mt-0.5"
            title="Ayuda"
          />
        )}
      </div>

      {/* Valor principal */}
      <div className="flex items-center flex-wrap text-white font-nunito font-bold 
                      text-lg sm:text-xl md:text-2xl lg:text-[24px] leading-tight tracking-normal mt-3">
        <span className="truncate max-w-full">{displayValue}</span>
      </div>

      {/* Hint opcional */}
      {hint && (
        <div className="text-xs sm:text-sm text-[#B0B0B0] mt-1 break-words">
          {hint}
        </div>
      )}

      {/* Fecha de actualización */}
      {updated && (
        <div className="text-xs sm:text-sm text-[#B0B0B0] mt-1">
          Actualizado el: {updated}
        </div>
      )}
    </div>
  );
}