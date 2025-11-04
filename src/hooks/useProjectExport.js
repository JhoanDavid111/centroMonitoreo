// src/hooks/useProjectExport.js
import { useCallback } from 'react';

/**
 * Hook para exportar datos de proyectos a CSV
 */
export function useProjectExport() {
  const exportToCSV = useCallback((data, filename = 'proyectos_filtrados.csv') => {
    if (!data || !data.length) return;
    
    const csvRows = [
      Object.keys(data[0]).join(','),
      ...data.map(row =>
        Object.values(row)
          .map(val => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { exportToCSV };
}

