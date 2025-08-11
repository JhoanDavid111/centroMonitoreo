// src/components/DataGrid/DataGridTable.jsx
import DataTable from 'react-data-table-component';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { darkTheme } from './styles/darkTheme';

const DataGridTable = ({ columns, data, loading, error, onExport, onViewChart }) => {
  if (loading) return <div className="text-center py-8 text-gray-400">Cargando datos...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-[#262626] p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-[#1f1f1f] placeholder-gray-500 text-white rounded p-2 w-1/3"
        />
        <button
          className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded hover:bg-yellow-500"
          onClick={() => onExport(data)}
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        theme="customDark"
        customStyles={darkTheme}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        paginationIconPrevious={<ChevronLeft size={20} />}
        paginationIconNext={<ChevronRight size={20} />}
        highlightOnHover
        onRowClicked={onViewChart}
      />
    </div>
  );
};

export default DataGridTable;