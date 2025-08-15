// src/service/apiServiceConvocatoriaTransmision.jsx
import { API } from '../config/api';


export const fetchProjectData = async (projectId) => {
  try {
    const response = await fetch(
      `${API}/v1/graficas/transmision/informacion_especifica_proyecto/${encodeURIComponent(projectId)}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    
    
    if (Array.isArray(data) && data.length > 0) {
      return transformApiData(data[0]);
    }
    
    throw new Error('No se encontraron datos para el proyecto');
  } catch (error) {
    console.error('Error fetching project data:', error);
    throw error;
  }
};

const formatApiDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const months = {
      ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06',
      jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12'
    };
    const monthKey = parts[1].toLowerCase().substring(0, 3);
    return `${parts[2]}-${months[monthKey]}-${parts[0].padStart(2, '0')}`;
  }
  return dateStr;
};

const transformApiData = (apiData) => {
  const transformSections = (sections) => {
    return sections?.map(section => ({
      title: section.title,
      barras: [
        { 
          label: 'Licencia ambiental', 
          value: section.license || 0, 
          color: 'bg-emerald-500' 
        },
        { 
          label: 'Avance en la construcción', 
          value: section.construction || 0, 
          color: 'bg-yellow-400' 
        }
      ]
    })) || [];
  };

  return {
    header: {
      title: apiData.header?.title || 'Proyecto sin nombre',
      status: apiData.header?.status || 'Estado desconocido',
      location: apiData.header?.location || 'Ubicación no especificada',
      investor: 'Datos no disponibles',
      stage: 'Datos no disponibles'
    },
    milestones: apiData.milestones?.map(milestone => ({
      title: milestone.title,
      value: formatApiDate(milestone.value),
      updated: milestone.updated ? formatApiDate(milestone.updated) : null,
      hasNote: false
    })) || [],
    progressSummary: apiData.progressSummary?.map(progress => ({
      title: progress.title,
      percentage: progress.percentage || 0,
      hasDelay: progress.hasDelay || false,
      delayDays: progress.delayDays || 0,
      updated: progress.updated || 'No actualizado'
    })) || [],
    //tramos: transformSections(apiData.sections?.filter(s => s.title.includes('Tramo'))) || [],
    //subestaciones: transformSections(apiData.sections?.filter(s => s.title.includes('Subestación'))) || [],
    tramos: transformSections(apiData.sections?.filter(s => s.title.includes('-'))) || [],
    subestaciones: transformSections(apiData.sections?.filter(s => !s.title.includes('-'))) || [],
    chartData: apiData.chartData || [],
    documents: apiData.documents || [],
    generacion: {
      totalProyectos: 0,
      totalMW: 0,
      solares: 0,
      eolicos: 0
    },
    sidebarInfo: apiData.sidebarInfo || {
      id: projectId,
      name: apiData.header?.title || 'Proyecto'
    }
  };
};