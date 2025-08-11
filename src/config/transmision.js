// src/config/transmision.js
import DemandaOn from '../assets/svg-icons/Demanda-On.svg';
import AutoGeneracionOn from '../assets/svg-icons/AutoGeneracion-On.svg';
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg';

export const TRANSMISION_CONFIG = {
  indicators: [
    {
      key: 'total_proyectos_convocatorias',
      label: 'Proyectos por convocatorias',
      icon: DemandaOn
    },
    {
      key: 'total_proyectos_str',
      label: 'Proyectos STR',
      icon: DemandaOn
    },
    {
      key: 'proyectos_adjudicacion',
      label: 'Proyectos en proceso de adjudicación',
      icon: AutoGeneracionOn
    },
    {
      key: 'convocatorias_proyectadas',
      label: 'Convocatorias proyectadas',
      icon: Proyecto075On
    },
    {
      key: 'total_lineas_convocatorias',
      label: 'Número total de líneas',
      icon: DemandaOn
    },
    {
      key: 'longitud_total_lineas_km',
      label: 'Longitud total de líneas (km)',
      icon: DemandaOn
    },
    {
      key: 'total_subestaciones_convocatorias',
      label: 'Total de subestaciones',
      icon: Proyecto075On
    }
  ]
};