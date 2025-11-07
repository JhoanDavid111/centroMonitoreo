// src/components/DataGrid/DataGridTable.jsx
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';
import { darkTableStyles, registerDarkDataTableTheme } from './styles/darkTheme';
import tokens from '../../styles/theme.js';

registerDarkDataTableTheme();
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
  showActionsColumn = false,
  isSTR = false,
  openFilter,
  setOpenFilter,
  showCurveButton = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Memoizar estilos para evitar recreación en cada render
  const customStyles = useMemo(() => ({
    ...darkTableStyles,
    tableWrapper: {
      style: {
        overflow: 'visible',
      },
    },
    table: {
      style: {
        ...(darkTableStyles.table?.style || {}),
        overflow: 'visible',
      },
    },
    headCells: {
      style: {
        fontSize: tokens.font.size.lg,
        fontWeight: tokens.font.weight.semibold,
        color: tokens.colors.text.primary,
        backgroundColor: tokens.colors.surface.primary,
        overflow: 'visible',
        paddingLeft: tokens.spacing.sm,
        paddingRight: tokens.spacing.sm,
      },
    },
    cells: {
      style: {
        fontSize: tokens.font.size.base,
        fontWeight: tokens.font.weight.regular,
        color: tokens.colors.text.secondary,
        overflow: 'visible',
        paddingLeft: tokens.spacing.sm,
        paddingRight: tokens.spacing.sm,
      },
    },
    rows: {
      style: {
        backgroundColor: tokens.colors.surface.primary,
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: tokens.colors.border.subtle,
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: tokens.colors.surface.secondary,
        transition: '0.2s ease-in-out',
      },
      stripedStyle: {
        backgroundColor: tokens.colors.surface.secondary,
      },
    },
    pagination: {
      style: {
        backgroundColor: tokens.colors.surface.primary,
        color: tokens.colors.text.secondary,
        borderTop: `1px solid ${tokens.colors.border.subtle}`,
        padding: tokens.spacing.sm,
      },
    },
    paginationButtons: {
      style: {
        color: tokens.colors.text.secondary,
        '&:hover': {
          backgroundColor: tokens.colors.surface.secondary,
        },
        '& svg': {
          stroke: tokens.colors.text.secondary,
        },
        '& svg path': {
          stroke: tokens.colors.text.secondary,
        },
      },
    },
  }), []);

  // Memoizar función para capitalizar texto
  const titleCase = useCallback((raw) => {
    if (typeof raw !== 'string') return raw;
    
    const connectors = ['y','de','la','el','los','las','en','a','por','para','con','sin','del','al','o','u'];
    return raw
      .split(' ')
      .map((word, index) => {
        if (word.includes('.')) return word.toUpperCase();
        const lower = word.toLowerCase();
        if (index > 0 && connectors.includes(lower)) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(' ');
  }, []);

  // Memoizar datos filtrados
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(row => {
      // Filtro global
      if (globalFilter && !Object.values(row).some(val => 
        String(val || '').toLowerCase().includes(globalFilter.toLowerCase()))
      ) return false;
      
      // Filtros por columna
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        // Manejo de campos anidados
        if (key.includes('.')) {
          const keys = key.split('.');
          const nestedValue = keys.reduce((obj, k) => (obj || {})[k], row);
          return String(nestedValue || '').toLowerCase().includes(value.toLowerCase());
        }
        
        return String(row[key] || '').toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [data, globalFilter, filters]);

  // Memoizar columnas procesadas
  const processedColumns = useMemo(() => {
    return columns.map(col => {
      if (!col.filterable) return col;
      
      return {
        ...col,
        name: (
          <div className="relative inline-block">
            <div className="flex items-center gap-1">
              <span>{col.name}</span>
              <div className="relative flex items-center">
                <Filter
                  className={`cursor-pointer ${
                    filters[col.selector]
                      ? 'text-white fill-white' // Cuando hay filtro: blanco sólido
                      : 'text-gray-500' // Por defecto: solo contorno
                  }`}
                  size={16}
                  strokeWidth={filters[col.selector] ? 2.5 : 1.5}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFilter(openFilter === col.selector ? '' : col.selector);
                  }}
                  aria-label={`Filtrar por ${col.name}`}
                />
                {/* Indicador de filtro activo */}
                
                {filters[col.selector] && (
                  <span 
                    className="absolute -top-1 -right-1 text-[8px] text-white leading-none"
                    style={{ lineHeight: '1' }}
                  >
                    ●
                  </span>
                )}
              </div>
            </div>
            {openFilter === col.selector && (
              <div className="absolute top-full left-0 mt-1 bg-surface-secondary p-2 rounded shadow-soft z-50">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={filters[col.selector] || ''}
                  onChange={e => setFilters({ ...filters, [col.selector]: e.target.value })}
                  className="bg-surface-primary text-white p-1 text-sm w-32 rounded"
                  autoFocus
                  aria-label={`Buscar en ${col.name}`}
                />
              </div>
            )}
          </div>
        ),
        cell: col.cell || ((row) => {
          const raw = row[col.selector] || '';
          if (typeof raw !== 'string') return raw;
          
          const formatted = titleCase(raw);
          const disp = formatted.length > 50 ? `${formatted.slice(0, 20)}...` : formatted;
          return <span title={formatted}>{disp}</span>;
        })
      };
    });
  }, [columns, filters, openFilter, setFilters, setOpenFilter, titleCase]);

  // Memoizar columnas finales
  const finalColumns = useMemo(() => {
    if (!showActionsColumn) return processedColumns;
    
    const actionColumn = {
      name: 'Acciones',
      cell: row => (
        <div className="flex space-x-2">
          <Link 
            to={isSTR 
              ? `/transmision_str_pages?projectId=${row.id}` 
              : `/transmision_pages?projectId=${row.numero_convocatoria}`
            }
            onClick={(e) => e.stopPropagation()}
            aria-label="Ver detalles del proyecto"
          >
            <img 
              src={ojoAmarillo} 
              alt="Ver proyecto" 
              className="w-5 h-5 cursor-pointer hover:opacity-80"
            />
          </Link>
          {showCurveButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewChart && onViewChart(row);
              }}
              aria-label="Ver curva S"
              className="focus:outline-none"
            >
              <img
                src={curvaSAmarillo}
                alt="Ver curva S"
                className="w-5 h-5 cursor-pointer hover:opacity-80"
              />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,
      width: '100px'
    };
    
    return [actionColumn, ...processedColumns];
  }, [showActionsColumn, processedColumns, isSTR, showCurveButton, onViewChart]);

  if (loading) return (
    <div className="bg-surface-primary p-6 rounded-lg shadow flex flex-col items-center justify-center h-64">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0s' }} />
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0.2s' }} />
        <div className="w-3 h-3 rounded-full animate-bounce bg-yellow-400" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-gray-300 mt-4">Cargando datos...</p>
    </div>
  );

  if (error) {
    const errorMessage = error?.message || error?.response?.data?.message || String(error || 'Error desconocido');
    return (
      <div className="bg-surface-primary p-6 rounded-lg shadow flex flex-col items-center justify-center h-64">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-500 text-center max-w-md">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-primary p-4 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="bg-surface-secondary placeholder-gray-500 text-white rounded p-2 w-full sm:w-1/3 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          aria-label="Buscar en todos los campos"
        />
        <button
          className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-2 rounded hover:bg-yellow-500 transition-colors w-full sm:w-auto justify-center"
          onClick={() => onExport(filteredData)}
          aria-label="Exportar a CSV"
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={finalColumns}
          data={filteredData}
          theme="customDark"
          customStyles={customStyles}
          pagination
          paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
          }}
          paginationIconPrevious={<ChevronLeft size={20} stroke="#cccccc" aria-hidden="true"/>}
          paginationIconNext={<ChevronRight size={20} stroke="#cccccc" aria-hidden="true"/>}
          paginationIconFirstPage={<ChevronLeft size={16} stroke="#cccccc" style={{ transform: 'rotate(180deg)' }} aria-hidden="true"/>}
          paginationIconLastPage={<ChevronRight size={16} stroke="#cccccc" style={{ transform: 'rotate(180deg)' }} aria-hidden="true"/>}
          highlightOnHover
          onRowClicked={undefined}
          striped
          pointerOnHover
          noDataComponent={
            <div className="py-8 text-center text-gray-400">
              No se encontraron resultados
            </div>
          }
        />
      </div>
    </div>
  );
};

export default DataGridTable;