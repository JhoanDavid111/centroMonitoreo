// src/components/ui/IndicatorCard.jsx
import { HelpCircle } from 'lucide-react';

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

  return (
    <div className={`bg-[#262626] p-5 rounded-lg border border-[#666666] shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-2 flex-wrap">
        {icon}
        <span className="ml-2 text-sm sm:text-base md:text-lg font-normal leading-snug text-[#B0B0B0]">
          {label}
        </span>
      </div>

      {/* Valor principal */}
      <div className="flex items-center flex-wrap text-white font-nunito font-bold 
                      text-lg sm:text-xl md:text-2xl lg:text-[24px] leading-tight tracking-normal">
        <span className="truncate max-w-full">{displayValue}</span>
        {showHelp && (
          <HelpCircle
            className="text-white cursor-pointer hover:text-gray-300 bg-neutral-700 rounded h-5 w-5 sm:h-6 sm:w-6 p-1 ml-2 sm:ml-3 flex-shrink-0"
            title="Ayuda"
          />
        )}
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
