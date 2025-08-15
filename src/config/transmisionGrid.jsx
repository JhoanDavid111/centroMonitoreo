// src/config/transmisionGrid.jsx
import {ImpactBadge} from '../components/ui/ImpactBadge';
//Colores basados en el esquema de color de la UPME
const COLORS_SCHEMES = {
  RED:{bg:'bg-red-900', text:'text-red-300'},
  ORANGE:{bg:'bg-orange-900', text:'text-orange-300'},
  YELLOW:{bg:'bg-yellow-700', text:'text-yellow-200'},
  GREEN:{bg:'bg-green-900', text:'text-green-300'},
};

//Limites de meses para clasificacion 
const MESES_THRESHOLDS = {
  MAYOR_SEIS: 6,
  ENTRE_TRES_Y_SEIS: 3,
  MENOR_TRES: 0,
  
};

function getColorByMesesAtraso(meses) {
 if(meses > MESES_THRESHOLDS.MAYOR_SEIS) return COLORS_SCHEMES.RED;
 if(meses > MESES_THRESHOLDS.ENTRE_TRES_Y_SEIS) return COLORS_SCHEMES.ORANGE;
 if(meses > MESES_THRESHOLDS.MENOR_TRES) return COLORS_SCHEMES.YELLOW;
  return COLORS_SCHEMES.GREEN;  
}

//Función para parsear los meses de atraso

function parseMesesAtraso(value) {
  // Casos especiales primero
  if (value === null || value === undefined || 
      typeof value === 'string' && (value.toLowerCase().includes('no reporta') || 
                                 value.toLowerCase().includes('se retiró'))) {
    return -1; // Valor especial para estos casos
  }


  
  if (typeof value === 'string') {
    const match = value.match(/-?\d+(\.\d+)?/);
    const num = match ? parseFloat(match[0]) : 0;
    return parseFloat(num.toFixed(2)); // Redondeo a 2 decimales
  }
  return parseFloat(Number(value).toFixed(2)) || 0;
}



//Definición de la columna de meses de atraso
const mesesDeAtrasoColumn = {
  name: "Meses de Atraso",
  selector: row => {
    const value = row.meses_de_atraso;
    if (value === null || value === undefined || 
        (typeof value === 'string' && (value.toLowerCase().includes('no reporta') || 
                                    value.toLowerCase().includes('se retiró')))) {
      return 'No reporta';
    }
    const parsed = parseMesesAtraso(value);
    return parsed === -1 ? 'No reporta' : parsed.toFixed(2);
  },
  sortable: true,
  width: "200px",
  sortFunction: (rowA, rowB) => {
    const a = parseMesesAtraso(rowA.meses_de_atraso);
    const b = parseMesesAtraso(rowB.meses_de_atraso);
    // Los valores especiales (-1) van al final
    if (a === -1 && b === -1) return 0;
    if (a === -1) return 1;
    if (b === -1) return -1;
    return a - b;
  },
  cell: row => {
    const value = row.meses_de_atraso;
    const isSpecialCase = value === null || value === undefined || 
                         (typeof value === 'string' && (value.toLowerCase().includes('no reporta') || 
                                                     value.toLowerCase().includes('se retiró')));
    
    if (isSpecialCase) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-gray-500 text-gray-200">
          No reporta
        </span>
      );
    }
    
    const meses = parseMesesAtraso(value);
    const { bg, text } = getColorByMesesAtraso(meses);
    const displayValue = meses % 1 === 0 ? meses.toString() : meses.toFixed(2);
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${bg} ${text}`}>
        {displayValue}
      </span>
    );
  }      
}


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
          width: "140px"
        },
        {
          name: "Nombre del Proyecto",
          selector: row => row.nombre_proyecto,
          sortable: true,
          width: "330px",
          cell: row => {
            const nombre = row.nombre_proyecto || '';
            const maxLength = 50;
            return (
              <span
                title={nombre}
                className="block truncate"
                >
                  {nombre.length > maxLength ? `${nombre.slice(0, maxLength)}...` : nombre}
                </span>
                

            );
          } 
        },
        {
          name: "Inversionista",
          selector: row => row.inversionista,
          sortable: true,
          width: "160px",
          //cell: row => <span title={row.inversionista}>{row.inversionista}</span>
          cell: row => {
            const inversionista = row.inversionista || '';
            const maxLength = 20;
            return (
              <span
                title={inversionista}
                className="block truncate"
                >
                  {inversionista.length > maxLength ? `${inversionista.slice(0, maxLength)}...` : inversionista}
                </span>
            );
          }

        },
        {
          name: "Departamento",
          selector: row => row.departamento.trim(),
          sortable: true,
          width: "145px",
          //cell: row => <span title={row.departamento}>{row.departamento}</span>
          cell: row => {
            const departamento = row.departamento || '';
            const maxLength = 20;
            return (
              <span
                title={departamento}
                className="block truncate"
                >
                  {departamento.length > maxLength ? `${departamento.slice(0, maxLength)}...` : departamento}
                </span>
            );
          }   
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
          width: "160px",
          cell: row => <span title={row.etapa}>{row.etapa}</span>
        },
        {
          name: "Avance Real",
          selector: row => `${(row.avance_real * 100).toFixed(1)}%`,
          sortable: true,
          width: "200px",
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
          xAxis: { categories: ['Avances'],
            title: { text: null }
           },
          yAxis: { title: { text: 'Porcentaje' }, 
          max: 100,
          labels: {
            formatter: function() {
              return this.value + '%';
            }
          }
         }
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
          width: "350px",
          //cell: row => <span title={row.nombre_proyecto}>{row.nombre_proyecto}</span>
          cell: row => {
            const nombre = row.nombre_proyecto || '';
            const maxLength = 50;
            return (
              <span
                title={nombre}
                className="block truncate"
                >
                  {nombre.length > maxLength ? `${nombre.slice(0, maxLength)}...` : nombre}
                </span>
                

            );
          } 
        },
        {
          name: "OR",
          selector: row => row.or,
          sortable: true,
          width: "140px"
        },
        {
          name: "Etapa",
          selector: row => row.etapa ? row.etapa.trim() : '-' ,
          sortable: true,
          width: "100px"
        },
        {
          name: "Estado",
          selector: row => row.estado ? row.estado.trim() : '-',
          sortable: true,
          width: "190px",
          cell: row => {
            const cellestado = row.estado || '';
            const maxLength = 50;
            return (
              <span
                title={cellestado}
                className="block truncate"
                >
                  {cellestado.length > maxLength ? `${cellestado.slice(0, maxLength)}...` : cellestado}
                </span>
                

            );
          } 
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
          name: "Clasificación Impacto",
          selector: row => row.clasificacion_por_impacto,
          sortable: true,
          width: "150px",
          cell: row => <ImpactBadge classification={row.clasificacion_por_impacto} />
       
        },
        mesesDeAtrasoColumn
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