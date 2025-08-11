// src/components/DataGrid/DataGridTable.jsx
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { darkTheme } from './styles/darkTheme';
import ojoAmarillo from '../../assets/ojoAmarillo.svg';
import curvaSAmarillo from '../../assets/curvaSAmarillo.svg';

const DataGridTable = ({ 
  columns, 
  data, 
  loading, 
  error, 
  onExport, 
  onViewChart,
  filters,
  setFilters,
  globalFilter,
  setGlobalFilter,
  showActionsColumn = false // Nuevo prop para controlar columna de acciones
}) => {
  // Estilos personalizados mejorados
  const customStyles = {
    table: {
      style: {
        backgroundColor: '#262626',
      },
    },
    headCells: {
      style: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#ffffff',
        backgroundColor: '#262626',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        fontWeight: 400,
        color: '#cccccc',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    rows: {
      style: {
        backgroundColor: '#262626',
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#1d1d1d',
        },
        '&:hover': {
          backgroundColor: '#3a3a3a',
          transition: '0.2s ease-in-out',
        },
      },
      stripedStyle: {
        backgroundColor: '#1d1d1d',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#262626',
        color: '#ececcc',
        borderTop: '1px solid #1d1d1d',
      },
    },
  };

  if (loading) return (
    <div className="bg-[#262626] p-6 rounded-lg shadow flex flex-col items-center justify-center h-64">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0s' }} />
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0.2s' }} />
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-gray-300 mt-4">Cargando datos...</p>
    </div>
  );

  if (error) return (
    <div className="bg-[#262626] p-6 rounded-lg shadow flex flex-col items-center justify-center h-64">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-500 text-center max-w-md">{error}</p>
    </div>
  );

  // Aplicar filtros
  const filteredData = data.filter(row => {
    // Filtro global
    if (globalFilter) {
      const matches = Object.values(row).some(val => 
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      );
      if (!matches) return false;
    }
    
    // Filtros por columna
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return String(row[key] || '').toLowerCase().includes(value.toLowerCase());
    });
  });

  // Añadir columna de acciones si es necesario
  const finalColumns = showActionsColumn 
    ? [
        {
          name: 'Acciones',
          cell: row => (
            <div className="flex space-x-2">
              <Link 
                to={`/transmision_pages?projectId=${encodeURIComponent(row.numero_convocatoria)}`}
                onClick={(e) => e.stopPropagation()}
              >
              <img 
                src={ojoAmarillo} 
                alt="Ver proyecto" 
                className="w-5 h-5 cursor-pointer"
              />
              </Link>
             {/*  <img 
                src={curvaSAmarillo} 
                alt="Ver curva S" 
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewChart(row);
                }}
              /> */}
            </div>
          ),
          ignoreRowClick: true,
          width: '100px',
          button: true
        },
        ...columns
      ]
    : columns;

  return (
   <div className="bg-[#262626] p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="bg-[#1f1f1f] placeholder-gray-500 text-white rounded p-2 w-1/3"
        />
        <button
          className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded hover:bg-yellow-500"
          onClick={() => onExport(data, columns)}
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <DataTable
        columns={finalColumns}
        data={data}
        theme="customDark"
        customStyles={customStyles}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        paginationIconPrevious={<ChevronLeft size={20} />}
        paginationIconNext={<ChevronRight size={20} />}
        highlightOnHover
        onRowClicked={onViewChart}
        striped
      />
    </div>
  );
};

export default DataGridTable;