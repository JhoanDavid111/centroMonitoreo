// src/components/ProjectGrid/ProjectGridFilters.jsx
import { Download } from 'lucide-react';

/**
 * Componente para barra de filtros y acciones
 */
export default function ProjectGridFilters({
  globalFilter,
  setGlobalFilter,
  onExport,
  exportLabel = 'Exportar CSV'
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <input
        type="text"
        placeholder="Buscar..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        className="bg-surface-secondary placeholder-gray-500 text-white rounded p-2 w-1/3"
      />
      <button
        className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded hover:bg-yellow-500"
        onClick={onExport}
      >
        <Download size={16} /> {exportLabel}
      </button>
    </div>
  );
}

