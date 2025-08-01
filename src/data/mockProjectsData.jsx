// src/data/mockProjectsData.jsx
// Simulación de los datos que devolvería la API para cada proyecto
export const mockProjectsData = {
  'sogamoso-norte': {
    header: { title: 'UPME 01 - 2013 Sogamoso - Norte - Nueva Esperanza 500 kV', status: 'En ejecución de obras', location: 'Sogamoso' },
    milestones: [
      { title: 'FPO reporte', value: '26/dic/2025', updated: '20/ene/2025' },
      { title: 'FPO inicial', value: '30/sep/2017', updated: '20/ene/2025' },
      { title: 'FPO estimada inter...', value: '18/ago/2027', updated: '4/feb/2025' },
      { title: 'No. de cambios FPO', value: '12 cambios', updated: '4/feb/2025' },
    ],
    progressSummary: [
      { title: 'Subestaciones', percentage: 56, hasDelay: true, delayDays: 950, updated: '15/feb/2025' },
      { title: 'Líneas de transmisión', percentage: 35, hasDelay: true, delayDays: 950, updated: '15/feb/2025' },
    ],
    sections: [
      { title: 'Tramo Sogamoso - Norte', license: 100, construction: 50 },
      { title: 'Tramo Norte - Nueva Esperanza', license: 100, construction: 0 },
      { title: 'Subestación Sogamoso', license: 100, construction: 50 },
      { title: 'Subestación Norte', license: 100, construction: 0 },
      { title: 'Subestación Nueva Esperanza', license: 100, construction: 0 },
    ],
    chartData: [
      { month: 'Ene 2023', programmed: 10, fulfilled: 5 },
      { month: 'Feb 2023', programmed: 20, fulfilled: 12 },
      { month: 'Mar 2023', programmed: 30, fulfilled: 25 },
      { month: 'Abr 2023', programmed: 40, fulfilled: 35 },
      { month: 'May 2023', programmed: 50, fulfilled: 48 },
      { month: 'Jun 2023', programmed: 60, fulfilled: 55 },
      { month: 'Jul 2023', programmed: 70, fulfilled: 68 },
      { month: 'Ago 2023', programmed: 80, fulfilled: 75 },
      { month: 'Sep 2023', programmed: 90, fulfilled: 88 },
      { month: 'Oct 2023', programmed: 95, fulfilled: 92 },
      { month: 'Nov 2023', programmed: 98, fulfilled: 95 },
      { month: 'Dic 2023', programmed: 100, fulfilled: 98 },
    ],
    documents: ['Especificaciones Tecnicas.pdf', 'Acta de Inicio.docx', 'Permisos Ambientales.zip'],
    // Datos adicionales que podría tener tu API para el sidebar o un listado de proyectos
    sidebarInfo: { id: 'sogamoso-norte', name: 'Sogamoso - Norte' }
  },
  'norte-nueva-esperanza': {
    header: { title: 'UPME 02 - 2014 Norte - Nueva Esperanza 230 kV', status: 'En diseño', location: 'Nueva Esperanza' },
    milestones: [
      { title: 'FPO reporte', value: '15/jun/2026', updated: '01/feb/2025' },
      { title: 'FPO inicial', value: '10/mar/2018', updated: '01/feb/2025' },
      { title: 'FPO estimada inter...', value: '01/dic/2028', updated: '15/mar/2025' },
      { title: 'No. de cambios FPO', value: '5 cambios', updated: '15/mar/2025' },
    ],
    progressSummary: [
      { title: 'Subestaciones', percentage: 10, hasDelay: false, delayDays: 0, updated: '20/feb/2025' },
      { title: 'Líneas de transmisión', percentage: 5, hasDelay: false, delayDays: 0, updated: '20/feb/2025' },
    ],
    sections: [
      { title: 'Tramo Norte - Nueva Esperanza', license: 80, construction: 10 },
      { title: 'Subestación Nueva Esperanza', license: 90, construction: 5 },
    ],
    chartData: [
      { month: 'Ene 2023', programmed: 0, fulfilled: 0 },
      { month: 'Feb 2023', programmed: 2, fulfilled: 1 },
      { month: 'Mar 2023', programmed: 5, fulfilled: 2 },
      // ... otros datos
    ],
    documents: ['Estudios de Impacto Ambiental.pdf', 'Plan de Ejecución.docx'],
    sidebarInfo: { id: 'norte-nueva-esperanza', name: 'Norte - Nueva Esperanza' }
  },
  // Agrega más objetos aquí para simular tus 10-100 proyectos
  'proyecto-fantasma': {
    header: { title: 'Proyecto Fantasma', status: 'Cancelado', location: 'Desconocida' },
    milestones: [],
    progressSummary: [],
    sections: [],
    chartData: [],
    documents: [],
    sidebarInfo: { id: 'proyecto-fantasma', name: 'Proyecto Fantasma' }
  }
};

// Puedes exportar también una función que simule la obtención de una lista de proyectos para el sidebar
export const getMockProjectList = () => {
  return Object.values(mockProjectsData).map(project => project.sidebarInfo);
};

// Función para obtener un proyecto específico por ID
export const getMockProjectData = (projectId) => {
  return new Promise(resolve => {
    // Simula un pequeño retraso de red
    setTimeout(() => {
      console.log(`Obteniendo datos del proyecto: ${projectId}`);
      resolve(mockProjectsData[projectId]);
    }, 300);
  });
};