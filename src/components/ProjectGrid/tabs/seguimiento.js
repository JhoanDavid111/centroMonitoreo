// src/components/ProjectGrid/tabs/seguimiento.js
export const seguimientoConfig = {
  columns: [
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <img 
            src="/assets/ojoAmarillo.svg" 
            alt="Ver proyecto" 
            className="w-5 h-5 cursor-pointer"
          />
          <img 
            src="/assets/curvaSAmarillo.svg" 
            alt="Ver curva S" 
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      ),
      width: '100px'
    },
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px'
    },
    // ... otras columnas específicas
  ],
  filters: ['id', 'nombre', 'capacidad', 'fpo', 'avance']
};