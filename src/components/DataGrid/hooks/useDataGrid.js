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
  
  const { filteredData, filters, setFilters, applyFilters } = useFilters(data);
  const { exportToCSV } = useExport();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

       
        const response = await fetch(config.tabs[activeTab].apiUrl, config.tabs[activeTab].fetchOptions);
       
       
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const jsonData = await response.json();

       
        setData(jsonData);
        applyFilters(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, config.tabs]);

  const handleTabChange = (index) => {
    setActiveTab(index);
    setChartOptions(null);
  };

  const handleViewChart = (row) => {
    if (config.tabs[activeTab].chart?.getOptions) {
      const options = config.tabs[activeTab].chart.getOptions(row);
      setChartOptions(options);
    }
  };

  return {
    activeTab,
    filteredData,
    loading,
    error,
    chartOptions,
    filters,
    setFilters,
    handleTabChange,
    handleViewChart,
    exportToCSV: () => exportToCSV(filteredData, config.tabs[activeTab].columns)
  };
};