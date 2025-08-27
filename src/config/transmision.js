// src/config/transmision.js

import iconConvocatoria from '../assets/svg-icons/Convocatorias2DarkmodeAmarillo.svg';
import iconProyectoSTR from '../assets/svg-icons/Proyecto075-On.svg';
import iconProyectoAdjudicacion from '../assets/svg-icons/tramitesDarkmodeAmarillo.svg';
import iconConvocatoriaProyectada from '../assets/svg-icons/OfertaDemanda-On.svg';
import iconLineaConvocatoria from '../assets/svg-icons/Transmision-On.svg';
import iconLongitudTotal from '../assets/svg-icons/arrow-rightDarkmodeAmarilloDarkmodeAmarillo.svg';
import iconTotalSubestaciones from '../assets/svg-icons/SubestacionDarkmodeAmarillo.svg';

export const TRANSMISION_CONFIG = {
  indicators: [
    {
      key: 'total_proyectos_convocatorias',
      label: 'Proyectos por convocatorias',
      icon: iconConvocatoria,
      showHelp: true
      
    },
    {
      key: 'total_proyectos_str',
      label: 'Proyectos STR',
      icon: iconProyectoSTR,
      showHelp: true
    },
    {
      key: 'proyectos_adjudicacion',
      label: 'Proyectos en proceso de adjudicación',
      icon: iconProyectoAdjudicacion,
      showHelp: true
    },
    {
      key: 'convocatorias_proyectadas',
      label: 'Convocatorias proyectadas',
      icon: iconConvocatoriaProyectada,
      showHelp: true

    },
    {
      key: 'total_lineas_convocatorias',
      label: 'Número total de líneas',
      icon: iconLineaConvocatoria,
      showHelp: true
    },
    {
      key: 'longitud_total_lineas_km',
      label: 'Longitud total de líneas (km)',
      icon: iconLongitudTotal,
      showHelp: true
    },
    {
      key: 'total_subestaciones_convocatorias',
      label: 'Total de subestaciones',
      icon: iconTotalSubestaciones,
      showHelp: true
    }
  ]
};