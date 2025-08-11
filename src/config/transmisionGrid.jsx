export const TRANSMISION_GRID_CONFIG = {
  title: "Proyectos de Transmisión",
  tabs: [
    {
      label: "Proyectos por Convocatorias",
      apiEndpoint: "/v1/graficas/transmision/listado_proyectos_transmision_convocatorias",
      table: true, // Añadido para indicar que muestra tabla
      columns: [
        {
          name: "Convocatoria",
          selector: row => row.numero_convocatoria,
          sortable: true,
          width: "150px"
        },
        {
          name: "Nombre del Proyecto",
          selector: row => row.nombre_proyecto,
          sortable: true,
          minWidth: "250px",
          cell: row => <span title={row.nombre_proyecto}>{row.nombre_proyecto}</span>
        },
        {
          name: "Inversionista",
          selector: row => row.inversionista,
          sortable: true,
          width: "200px"
        },
        {
          name: "Departamento",
          selector: row => row.departamento.trim(),
          sortable: true,
          width: "150px"
        },
        {
          name: "FPO Vigente",
          selector: row => row.fpo_vigente?.split('T')[0] || '-',
          sortable: true,
          width: "120px"
        },
        {
          name: "Etapa",
          selector: row => row.etapa,
          sortable: true,
          width: "200px"
        },
        {
          name: "Avance Real",
          selector: row => `${(row.avance_real * 100).toFixed(1)}%`,
          sortable: true,
          width: "120px",
          cell: row => (
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full" 
                style={{ width: `${row.avance_real * 100}%` }}
              ></div>
            </div>
          )
        }
      ],
      filters: ['numero_convocatoria', 'nombre_proyecto', 'inversionista', 'departamento', 'etapa'],
      chart: { // Añadida configuración de gráfico
        getOptions: (row) => ({
          title: { text: `Avances - ${row.nombre_proyecto}` },
          series: [
            {
              name: 'Avance General',
              data: [row.avance_real * 100]
            },
            {
              name: 'Avance Subestación',
              data: [row.avance_real_subestacion * 100]
            },
            {
              name: 'Avance Línea',
              data: [row.avance_real_linea * 100]
            }
          ],
          chart: { type: 'bar' },
          xAxis: { categories: ['Avances'] },
          yAxis: { title: { text: 'Porcentaje' }, max: 100 }
        })
      }
    },
    {
      label: "Proyectos STR",
      apiEndpoint: "/v1/graficas/transmision/listado_proyectos_transmision_str",
      table: true, // Añadido para indicar que muestra tabla
      columns: [
        {
          name: "Nombre del Proyecto",
          selector: row => row.nombre_proyecto,
          sortable: true,
          minWidth: "250px",
          cell: row => <span title={row.nombre_proyecto}>{row.nombre_proyecto}</span>
        },
        {
          name: "OR",
          selector: row => row.or,
          sortable: true,
          width: "120px"
        },
        {
          name: "Etapa",
          selector: row => row.etapa,
          sortable: true,
          width: "100px"
        },
        {
          name: "Estado",
          selector: row => row.estado.trim(),
          sortable: true,
          width: "200px"
        },
        {
          name: "Generación Asociada",
          selector: row => row.generacion_asociada_a_proyecto || 'No',
          sortable: true,
          width: "150px"
        },
        {
          name: "FPO UPME",
          selector: row => row.fpo_concepto_upme?.split(' ')[0] || '-',
          sortable: true,
          width: "120px"
        },
        {
          name: "Impacto",
          selector: row => row.clasificacion_por_impacto,
          sortable: true,
          width: "100px",
          cell: row => (
            <span className={`px-2 py-1 rounded-full text-xs ${
              row.clasificacion_por_impacto === 'A' ? 'bg-green-900 text-green-300' :
              row.clasificacion_por_impacto === 'D' ? 'bg-red-900 text-red-300' :
              'bg-gray-700 text-gray-300'
            }`}>
              {row.clasificacion_por_impacto}
            </span>
          )
        }
      ],
      filters: ['nombre_proyecto', 'or', 'etapa', 'estado', 'clasificacion_por_impacto'],
      chart: { // Añadida configuración de gráfico
        getOptions: (row) => ({
          title: { text: `Detalles - ${row.nombre_proyecto}` },
          series: [{
            name: 'Nivel Seguimiento',
            data: [parseInt(row.radar_de_seguimiento_nivel) || 0],
            type: 'gauge'
          }],
          pane: {
            startAngle: -90,
            endAngle: 90,
            background: null,
            center: ['50%', '75%'],
            size: '110%'
          },
          yAxis: {
            min: 0,
            max: 3,
            tickPositions: [0, 1, 2, 3]
          }
        })
      }
    }
  ]
};