// src/components/charts/HelpButton.jsx
// Componente reutilizable para botón de ayuda en gráficas

export default function HelpButton({ onClick, className = '' }) {
  return (
    <button
      className={`absolute top-[25px] right-[60px] z-10 flex items-center justify-center bg-[#444] rounded-lg shadow hover:bg-[#666] transition-colors ${className}`}
      style={{ width: 30, height: 30 }}
      title="Ayuda"
      onClick={onClick}
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" className="rounded-full">
        <circle cx="12" cy="12" r="10" fill="#444" stroke="#fff" strokeWidth="2.5" />
        <text 
          x="12" 
          y="18" 
          textAnchor="middle" 
          fontSize="16" 
          fill="#fff" 
          fontWeight="bold" 
          fontFamily="Nunito Sans, sans-serif"
        >
          ?
        </text>
      </svg>
    </button>
  );
}

