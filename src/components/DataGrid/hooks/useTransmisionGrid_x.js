// src/components/DataGrid/hooks/useTransmisionGrid_x.js
import { useState } from 'react';
import { useDataGrid } from './useDataGrid';

export function useTransmisionGrid(config) {
  const {
    activeTab,
    filteredData,
    loading,
    error,
    chartOptions,
    handleTabChange,
    handleViewChart,
    exportToCSV
  } = useDataGrid(config);

  // Funcionalidad adicional específica para Transmisión
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    // Lógica adicional si es necesario
  };

  return {
    activeTab,
    filteredData,
    loading,
    error,
    chartOptions,
    selectedProject,
    handleTabChange,
    handleViewChart,
    handleSelectProject,
    exportToCSV
  };
}