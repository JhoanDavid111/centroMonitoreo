// src/components/DataGrid/hooks/useDataGrid.js
import { useState, useEffect } from 'react';
import { useFilters } from './useFilters';
import { useExport } from './useExport';

export const useDataGrid = (config) => {
    const [activeTab, setActiveTab] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState({});
    
    const { filteredData, filters, setFilters, applyFilters } = useFilters(data);
    const { exportToCSV } = useExport();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!config.tabs || !config.tabs[activeTab]) {
                    throw new Error('Configuración de pestañas no válida');
                }

                const currentTab = config.tabs[activeTab];
                const response = await fetch(currentTab.apiUrl, currentTab.fetchOptions || {});
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const jsonData = await response.json();
                setData(jsonData);
                applyFilters(jsonData);
                // Inicializar filtros por columna
                const initialFilters = {};
                config.tabs[activeTab].columns.forEach(col => {
                    if (col.filter) {
                        initialFilters[col.selector.replace('row.', '')] = '';
                    }
                });
                setColumnFilters(initialFilters);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
        exportToCSV: () => exportToCSV(applyAllFilters(filteredData), config.tabs[activeTab].columns)
    };
};