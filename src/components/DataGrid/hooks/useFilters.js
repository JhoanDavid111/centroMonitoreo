//src/components/DataGrid/hooks/useFilters.js
import { useState, useEffect } from 'react';

export const useFilters = (initialData) => {
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState(initialData || []);

  const applyFilters = (data) => {
    if (!data || !data.length) {
      setFilteredData([]);
      return;
    }

    const result = data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key];
        if (itemValue === undefined || itemValue === null) return false;
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      });
    });

    setFilteredData(result);
  };

  useEffect(() => {
    applyFilters(initialData);
  }, [filters, initialData]);

  return { 
    filteredData, 
    filters, 
    setFilters,
    applyFilters
  };
};