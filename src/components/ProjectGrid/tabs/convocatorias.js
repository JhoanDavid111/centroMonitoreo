export const convocatoriasConfig = {
    label: 'Proyectos con Convocatorias',
    table: true,
    columns: [
        {
            name: 'Convocatoria',
            selector: row => row.numero_convocatoria,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Nombre Proyecto',
            selector: row => row.nombre_proyecto,
            sortable: true,
            wrap: true
        },
        {
            name: 'Inversionista',
            selector: row => row.inversionista,
            sortable: true
        },
        {
            name: 'Departamento',
            selector: row => row.departamento,
            sortable: true,
            width: '120px'
        },
        {
            name: 'FPO Vigente',
            selector: row => new Date(row.fpo_vigente).toLocaleDateString(),
            sortable: true,
            width: '100px'
        },
        {
            name: 'Etapa',
            selector: row => row.etapa,
            sortable: true
        },
        {
            name: 'Avance Real',
            selector: row => `${(row.avance_real * 100).toFixed(1)}%`,
            sortable: true,
            right: true,
            width: '100px'
        }
    ],
    filters: ['numero_convocatoria', 'nombre_proyecto', 'inversionista', 'departamento', 'etapa'],
    chart: {
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
};