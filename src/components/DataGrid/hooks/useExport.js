// src/components/DataGrid/hooks/useExport.js
export const useExport = () => {
    const exportToCSV = (data, columns) => {
        if (!data || !data.length || !columns || !columns.length) {
            console.warn('No hay datos o columnas para exportar');
            return;
        }

        // Obtener nombres de columnas
        const headers = columns.map(col => col.name || '');

        // Obtener funciones de acceso a los datos con manejo seguro
        const getters = columns.map(col => {
            if (typeof col.selector === 'function') {
                return row => {
                    try {
                        const value = col.selector(row);
                        return value === null || value === undefined ? '' : value;
                    } catch (error) {
                        console.warn(`Error al obtener valor para ${col.name}:`, error);
                        return '';
                    }
                };
            }
            // Si el selector es string, convertirlo a función
            const prop = typeof col.selector === 'string' ? col.selector.replace('row.', '') : '';
            return row => {
                const value = prop ? row[prop] : '';
                return value === null || value === undefined ? '' : value;
            };
        });

        // Función para escapar valores CSV con manejo seguro de métodos
        const escapeCsvValue = (value) => {
            if (value === null || value === undefined) return '';
            
            // Manejar casos donde value es un objeto con métodos
            let strValue;
            try {
                strValue = typeof value === 'object' && value !== null && typeof value.toString === 'function' 
                    ? value.toString() 
                    : String(value);
                
                // Si el valor tiene un método trim, aplicarlo seguramente
                if (typeof strValue.trim === 'function') {
                    strValue = strValue.trim();
                }
            } catch (error) {
                console.warn('Error al convertir valor a string:', error);
                strValue = '';
            }

            // Escapar comillas y envolver en comillas si contiene comas, saltos de línea o comillas
            return /[,"\n]/.test(strValue) ? `"${strValue.replace(/"/g, '""')}"` : strValue;
        };

        // Construir filas CSV
        const csvRows = [
            headers.join(','),
            ...data.map(row => 
                getters.map(getValue => escapeCsvValue(getValue(row))).join(',')
            )
        ];

        // Crear y descargar archivo
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.href = url;
        link.setAttribute('download', 'proyectos_strs.csv');
        document.body.appendChild(link);
        link.click();
        
        // Limpieza
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    };

    return { exportToCSV };
};