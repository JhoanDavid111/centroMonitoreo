export const strConfig = {
    label: 'Proyectos STR',
    table: true,
    columns: [
        {
            name: 'Proyecto',
            selector: row => row.nombre_proyecto,
            sortable: true,
            wrap: true
        },
        {
            name: 'OR',
            selector: row => row.or,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Etapa',
            selector: row => row.etapa,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Estado',
            selector: row => row.estado,
            sortable: true
        },
        {
            name: 'Generación Asociada',
            selector: row => row.generacion_asociada_a_proyecto || 'No',
            sortable: true,
            width: '120px'
        },
        {
            name: 'FPO UPME',
            selector: row => row.fpo_concepto_upme ? new Date(row.fpo_concepto_upme).toLocaleDateString() : 'N/A',
            sortable: true,
            width: '100px'
        },
        {
            name: 'Impacto',
            selector: row => row.clasificacion_por_impacto,
            sortable: true,
            width: '80px'
        }
    ],
    filters: ['nombre_proyecto', 'or', 'etapa', 'estado', 'clasificacion_por_impacto'],
    chart: {
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
                tickPositions: [0, 1, 2, 3],
                labels: {
                    distance: -20,
                    style: {
                        fontSize: '10px'
                    }
                }
            }
        })
    }
};