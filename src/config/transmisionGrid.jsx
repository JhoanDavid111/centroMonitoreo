// src/config/transmisionGrid.jsx
import { ImpactBadge } from '../components/ui/ImpactBadge';
import { TooltipPer } from '../components/ui/TooltipPer';
//Colores basados en el esquema de color de la UPME
const COLORS_SCHEMES = {
  RED: { bg: 'bg-red-900', text: 'text-red-ß300' },
  ORANGE: { bg: 'bg-orange-900', text: 'text-orange-300' },
  YELLOW: { bg: 'bg-yellow-700', text: 'text-yellow-200' },
  GREEN: { bg: 'bg-green-900', text: 'text-green-300' },
};

//Limites de meses para clasificacion
const MESES_THRESHOLDS = {
  MAYOR_SEIS: 6,
  ENTRE_TRES_Y_SEIS: 3,
  MENOR_TRES: 0,

};

function getColorByMesesAtraso(meses) {
  if (meses > MESES_THRESHOLDS.MAYOR_SEIS) return COLORS_SCHEMES.RED;
  if (meses > MESES_THRESHOLDS.ENTRE_TRES_Y_SEIS) return COLORS_SCHEMES.ORANGE;
  if (meses > MESES_THRESHOLDS.MENOR_TRES) return COLORS_SCHEMES.YELLOW;
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
  title: "Proyectos de transmisión",
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
            const maxLength = 100;
            const visible = nombre.length > maxLength ? `${nombre.slice(0, maxLength)}...` : nombre;
            return (
              <div className="relative overflow-visible inline-block">
                <TooltipPer
                  tooltip={nombre}
                  align="center"     // Alineación a la izquierda
                  offsetX={0}     // 10px a la derecha
                  maxWidth="max-w-md" // Ancho máximo mayor
                  width="max-w-none" // Esto permite que el tooltip se expanda según el contenido
                  tooltipClass="whitespace-nowrap" // Forzar una sola línea
                >
                  <span className="block truncate max-w-[300px]">{visible}</span>
                </TooltipPer>

              </div>





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
            const maxLength = 30;
            const visible = inversionista.length > maxLength ? `${inversionista.slice(0, maxLength)}...` : inversionista;
            // Si el nombre es muy largo, mostrar un tooltip
            return (
              <div className='relative overflow-visible inline-block'>
                <TooltipPer
                  tooltip={inversionista}
                  align="center"     // Alineación a la izquierda
                  offsetX={0}     // 10px a la derecha
                  maxWidth="max-w-md" // Ancho máximo mayor
                  width="max-w-none" // Esto permite que el tooltip se expanda según el contenido
                  tooltipClass="whitespace-nowrap" // Forzar una sola línea
                >
                  <span className="block truncate max-w-[150px]">{visible}</span>
                </TooltipPer>
              </div>
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
              <div className="relative overflow-visible inline-block">
                <TooltipPer
                  tooltip={departamento}
                  align="center"     // Alineación a la izquierda
                  offsetX={0}     // 10px a la derecha
                  maxWidth="max-w-md" // Ancho máximo mayor
                  width="max-w-none" // Esto permite que el tooltip se expanda según el contenido
                  tooltipClass="whitespace-nowrap" // Forzar una sola línea
                >
                  <span className="block truncate max-w-[120px]">{departamento.length > maxLength ? `${departamento.slice(0, maxLength)}...` : departamento}</span>
                </TooltipPer>
              </div>
            );
          }
        },
        {
          name: "FPO",
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
          name: "Avance general",
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
      // src/config/transmisionGrid.jsx
      // En la configuración del chart, cambia a esta estructura:
      chart: {
        getOptions: (row) => {
          const avanceGeneral = parseFloat(row.avance_real) || 0;
          const avanceSubestacion = parseFloat(row.avance_real_subestacion) || 0;
          const avanceLinea = parseFloat(row.avance_real_linea) || 0;

          return {
            title: {
              text: `Avances - ${row.nombre_proyecto}`,
              style: { color: '#FFFFFF' }
            },
            chart: {
              type: 'column',
              backgroundColor: '#262626',
              spacing: [20, 10, 10, 10]
            },

            //  eje X categórico y sin usar "categories"
            xAxis: {
              type: 'category',
              tickPositions: [0, 1, 2],
              tickInterval: 1,
              title: { text: null },
              labels: {
                style: { color: '#FFFFFF', fontSize: '11px', fontWeight: 'bold' },
                rotation: 0,
                step: 1,
                y: 20,
                x: 45,
                crop: false,       // no recortes
                overflow: 'allow', // permite sobresalir del plot area
                reserveSpace: true
              }
            },

            yAxis: {
              title: { text: 'Porcentaje', style: { color: '#FFFFFF' } },
              min: 0,
              max: 100,
              labels: {
                style: { color: '#FFFFFF' },
                formatter: function () { return this.value + '%'; }
              },
              gridLineColor: '#404040'
            },

            plotOptions: {
              column: {
                colorByPoint: true,
                colors: ['#FFD700', '#FF8C00', '#32CD32'],
                pointPadding: 0.1,
                groupPadding: 0.1,
                dataLabels: {
                  enabled: true,
                  style: { color: '#FFFFFF', fontWeight: 'bold', textOutline: 'none', fontSize: '11px' },
                  formatter: function () { return this.y.toFixed(1) + '%'; }
                }
              }
            },
            tooltip: {
              backgroundColor: '#1f1f1f',
              borderColor: '#FFD700',
              borderRadius: 8,
              borderWidth: 1,
              style: { color: '#FFFFFF', fontSize: '12px' },
              useHTML: true,
              formatter: function () {
                return `<b>${this.point.name}</b>: ${this.y.toFixed(1)}%`;
              }
            },

            // nombres en los puntos (el eje toma estos nombres)
            series: [{
              name: 'Porcentaje',
              data: [
                { name: 'Avance General', y: avanceGeneral * 100 },
                { name: 'Avance Subestación', y: avanceSubestacion * 100 },
                { name: 'Avance Línea', y: avanceLinea * 100 }
              ]
            }],

            legend: { enabled: false },
            credits: { enabled: false },

            // margen inferior extra para que nunca se corten
            marginBottom: 90
          };
        }
      }

    },
    {
      label: "Proyectos STR",
      apiEndpoint: "/v1/graficas/transmision/listado_proyectos_transmision_str",
      table: true, // Añadido para indicar que muestra tabla
      columns: [
        {
          name: "Nombre del Proyecto",
          selector: row => row.nombre_proyecto ? row.nombre_proyecto.trim() : '-',
          sortable: true,
          width: "350px",
          //cell: row => <span title={row.nombre_proyecto}>{row.nombre_proyecto}</span>
          cell: row => {
            const nombre = row.nombre_proyecto || '';
            const maxLength = 100;
            const visible = nombre.length > maxLength ? `${nombre.slice(0, maxLength)}...` : nombre;
            return (
              <div className="relative overflow-visible inline-block">
                <TooltipPer
                  tooltip={nombre}
                  align="left"     // Alineación a la izquierda
                  offsetX={10}     // 10px a la derecha
                  maxWidth="max-w-md" // Ancho máximo mayor
                  width="max-w-none" // Esto permite que el tooltip se expanda según el contenido
                  tooltipClass="whitespace-nowrap" // Forzar una sola línea
                >
                  <span className="block truncate max-w-[300px]">{visible}</span>
                </TooltipPer>

              </div>





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
          selector: row => row.etapa ? row.etapa.trim() : '-',
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
            const visible = cellestado.length > maxLength ? `${cellestado.slice(0, maxLength)}...` : cellestado;
            return (
              <div className="relative overflow-visible inline-block">
                <TooltipPer
                  tooltip={cellestado}
                  width="max-w-none" // Esto permite que el tooltip se expanda según el contenido
                  tooltipClass="whitespace-nowrap" // Forzar una sola línea
                >
                  <span className="block truncate max-w-[170px]">{visible}</span>
                </TooltipPer>
              </div>


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
          name: "FPO",
          selector: row => row.fpo_concepto_upme?.split(' ')[0] || '-',
          sortable: true,
          width: "120px"
        },
        {
          name: "Impacto",
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
