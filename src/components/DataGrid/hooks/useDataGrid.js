// src/components/DataGrid/hooks/useDataGrid.js
import { useState, useEffect } from 'react';
import { useFilters } from './useFilters';
import { useExport } from './useExport';
import { useDataGridCache } from './useDataGridCache';

export const useDataGrid = (config) => {
    const [activeTab, setActiveTab] = useState(0);
   
    const [chartOptions, setChartOptions] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState({});
    const [openFilter, setOpenFilter] = useState(''); 


    // Usar el hook de cache
    const { data, loading, error, refetchTab, refetchAll } = useDataGridCache(config, activeTab);
    
    const { filteredData, filters, setFilters, applyFilters } = useFilters(data);
    const { exportToCSV } = useExport();

    useEffect(() => {
        if (data) {
            applyFilters(data);
        }
    }, [data, applyFilters]);

    useEffect(() => {
        // Inicializar filtros por columna cuando cambia la pestaña
        const initialFilters = {};
        if (config.tabs?.[activeTab]?.columns) {
            config.tabs[activeTab].columns.forEach(col => {
                if (col.filter) {
                    initialFilters[col.selector.replace('row.', '')] = '';
                }
            });
        }
        setColumnFilters(initialFilters);
    }, [activeTab, config.tabs]);

    // Aplicar todos los filtros
    const applyAllFilters = (data) => {
        let result = [...data];
        
        // Filtro global
        if (globalFilter) {
            result = result.filter(row => 
                Object.values(row).some(val => 
                    String(val).toLowerCase().includes(globalFilter.toLowerCase())
                )
            );
        }
        
        // Filtros por columna
        result = result.filter(row => 
            Object.entries(columnFilters).every(([key, value]) => {
                if (!value) return true;
                return String(row[key] || '').toLowerCase().includes(value.toLowerCase());
            })
        );
        
        return result;
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
        setChartOptions(null);
        setGlobalFilter('');
        setColumnFilters({});
    };

    const handleViewChart = (row) => {
        if (config.tabs[activeTab]?.chart?.getOptions) {
            const options = config.tabs[activeTab].chart.getOptions(row);
            setChartOptions(options);
        }
    };

    return {
        activeTab,
        filteredData: applyAllFilters(filteredData),
        loading,
        error,
        chartOptions,
        filters: columnFilters,
        setFilters: setColumnFilters,
        globalFilter,
        setGlobalFilter,
        handleTabChange,
        handleViewChart,
        openFilter, 
        setOpenFilter, 
        exportToCSV: () => exportToCSV(applyAllFilters(filteredData), config.tabs[activeTab].columns)
    };
};