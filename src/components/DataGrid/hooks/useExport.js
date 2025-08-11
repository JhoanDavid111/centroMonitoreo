// src/components/DataGrid/hooks/useExport.js
export const useExport = () => {
  const exportToCSV = (data, columns) => {
    if (!data || !data.length) return;
    
    const headers = columns.map(col => col.name);
    const keys = columns.map(col => col.selector.replace('row.', ''));
    
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        keys.map(key => 
          `"${String(row[key] || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { exportToCSV };
};