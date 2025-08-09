// src/components/Sidebar.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES, ROLE_PERMISSIONS } from '../config/roles'; // Importa tus roles y permisos

// Estas importaciones devuelven URLs al SVG en Vite
import DashboardOff from '../assets/svg-icons/Dashboard-Off.svg';
import DashboardOn from '../assets/svg-icons/Dashboard-On.svg';
import GWOff from '../assets/svg-icons/6GW-off.svg';
import GWOn from '../assets/svg-icons/6GW-on.svg';
import ComunidadesEnergOff from '../assets/svg-icons/ComunidadesEnerg-Off.svg';
import ComunidadesEnergOn from '../assets/svg-icons/ComunidadesEnerg-On.svg';
import Proyecto075Off from '../assets/svg-icons/Proyecto075-Off.svg';
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg';
import AccionesEstrategicasOff from '../assets/svg-icons/AccionesEstrategicas-Off.svg';
import AccionesEstrategicasOn from '../assets/svg-icons/AccionesEstrategicas-On.svg';
import ProyectosTransmisionOn from '../assets/svg-icons/Transmision-On.svg';
import ProyectosTransmisionOff from '../assets/svg-icons/Transmision-Off.svg';
// Importaciones que no usabas, pero las mantengo por si las necesitas:
// import AutogeneracionOff from '../assets/svg-icons/Autogeneracion-Off.svg'
// import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg'
// import HidroOff from '../assets/svg-icons/Hidrologia-Off.svg'
// import HidroOn from '../assets/svg-icons/Hidrologia-On.svg'
// import EnergiaOff from '../assets/svg-icons/EnergiaElectrica-Off.svg'
// import EnergiaOn from '../assets/svg-icons/EnergiaElectrica-On.svg'
// import PreciosOff from '../assets/svg-icons/Precios-Off.svg'
// import PreciosOn from '../assets/svg-icons/Precios-On.svg'
// import GeneracionTermicaOff from '../assets/svg-icons/GeneracionTermica-Off.svg'
// import GeneracionTermicaOn from '../assets/svg-icons/GeneracionTermica-On.svg'
// import DemandaOff from '../assets/svg-icons/Demanda-Off.svg'
// import DemandaOn from '../assets/svg-icons/Demanda-On.svg'
// import TransmisionOff from '../assets/svg-icons/Transmision-Off.svg'
// import TransmisionOn from '../assets/svg-icons/Transmision-On.svg'


export function Sidebar({ open, toggle, userRole }) { // userRole ya lo estás recibiendo, ¡perfecto!
  const { pathname } = useLocation();

  // --- Funciones auxiliares para verificar permisos/roles ---
  /**
   * Verifica si el rol del usuario tiene un permiso específico.
   * @param {string} permission - El nombre del permiso a verificar.
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    // Si no hay rol o si los permisos para ese rol no están definidos, deniega el acceso.
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
      return false;
    }

    const userPermissions = ROLE_PERMISSIONS[userRole];

    // Si el rol tiene el permiso de acceso total ('*'), siempre tiene el permiso.
    if (userPermissions.includes('*')) {
      return true;
    }

    // Verifica si el rol tiene el permiso específico que se le pide.
    return userPermissions.includes(permission);
  };

  /**
   * Verifica si el rol del usuario está en una lista de roles permitidos.
   * @param {string[]} allowedRolesArray - Un array de roles que están permitidos.
   * @returns {boolean}
   */
  const isInAllowedRoles = (allowedRolesArray) => {
    // Si no hay rol, o si no se especifican roles permitidos (significa que cualquier logueado puede verlo),
    // o si el rol del usuario está en la lista.
    if (!userRole) return false;
    if (!allowedRolesArray || allowedRolesArray.length === 0) return true; // Si no se restringe por rol, se muestra.
    return allowedRolesArray.includes(userRole);
  };
  // --- Fin funciones auxiliares ---


  // --- Definición de secciones y ítems con sus permisos/roles ---
  const sections = [
    {
      title: 'Inicio',
      path: '/',
      icon: DashboardOff,
      activeIcon: DashboardOn,
      permission: 'dashboard' // Asumimos que la ruta de inicio también requiere el permiso de dashboard
    },
    {
      title: 'ESTRATEGIA 6GW+',
      items: [
        {
          title: 'Resumen',
          path: '/6GW+',
          icon: GWOff,
          activeIcon: GWOn,
          permission: 'dashboard' // Requiere el permiso 'dashboard'
        },
        {
          title: 'Proyectos 075',
          path: '/proyectos075',
          icon: Proyecto075Off,
          activeIcon: Proyecto075On,
          permission: 'proyectos' // Requiere el permiso 'proyectos'
        },
        {
          title: 'Transmisión',
          path: '/Transmision',
          icon: ProyectosTransmisionOff,
          activeIcon: ProyectosTransmisionOn,
          roles: [ROLES.ADMIN, ROLES.CONSULTOR_1] // Solo para Administrador y Consultor 1
        },
        {
          title: 'Comunidades energéticas',
          path: '/comunidades_energeticas',
          icon: ComunidadesEnergOff,
          activeIcon: ComunidadesEnergOn,
          permission: 'comunidades' // Requiere el permiso 'comunidades'
        },
        {
          title: 'Acciones estratégicas',
          path: '/estrategia-6gw', // Cambié a la ruta que definiste para esta sección con allowedRoles
          icon: AccionesEstrategicasOff,
          activeIcon: AccionesEstrategicasOn,
          roles: [ROLES.ADMIN] // Solo para Administradores
        },
        {
          title: 'Transmisión Pages',
          path: '/transmision_pages?projectId=norte-nueva-esperanza',
          icon: ProyectosTransmisionOff,
          activeIcon: ProyectosTransmisionOn,
          roles: [ROLES.ADMIN, ROLES.CONSULTOR_1] // Solo para Administrador y Consultor 1
        },
        /*
        {
          title: 'Autogeneración y GD',
          path: '/en_construccion',
          icon: AutogeneracionOff,
          activeIcon: AutogeneracionOn,
          // Si no se especifica permiso ni rol, se muestra a cualquier autenticado
        },
        */
      ]
    },
    /* Puedes descomentar y agregar permisos/roles a estas secciones si las usas
    {
      title: 'ABASTECIMIENTO',
      items: [
        {
          title: 'Hidrología',
          path: '/en_construccion',
          icon: HidroOff,
          activeIcon: HidroOn,
          permission: 'hidrologia' // Ejemplo de permiso
        },
        {
          title: 'Suficiencia energética',
          path: '/en_construccion',
          icon: EnergiaOff,
          activeIcon: EnergiaOn,
          permission: 'suficiencia' 

        },
        {
          title: 'Precios',
          path: '/en_construccion',
          icon: PreciosOff,
          activeIcon: PreciosOn,
          permission: 'precios' // Ejemplo de permiso
        },
        {
          title: 'Generación térmica',
          path: '/en_construccion',
          icon: GeneracionTermicaOff,
          activeIcon: GeneracionTermicaOn,
          permission: 'termica
        },
        {
          title: 'Demanda',
          path: '/en_construccion',
          icon: DemandaOff,
          activeIcon: DemandaOn,
          permission: 'demanda' // Ejemplo de demanda
        }
      ]
    },
    {
      title: 'TARIFAS',
      items: [
        {
          title: 'Combustibles líquidos',
          path: '/combustibles',
          icon: CombustiblesOff,
          activeIcon: CombustiblesOn,
          permission: 'combustibles' // Ejemplo de permiso
        },
         {
          title: 'Gas Natural',
          path: '/gas-natural',
          icon: GasOff,
          activeIcon: GasOn,
          permission: 'combustibles'
        },
        {
          title: 'GLP',
          path: '/GLP',
          icon: GLPOff,
          activeIcon: GLPOn,
          permission: 'combustibles'
        }
        
      ]
    }
    */
  ];
  // --- Fin definición de secciones y ítems ---


  return (
    <aside
      className={`bg-[#262626] font-sans mt-3 sticky top-24 text-gray-300 h-screen overflow-y-auto flex flex-col transition-all duration-300 ${
        open ? 'w-1/6 p-4' : 'w-16 p-2'
      }`}
    >
      {/* Toggle button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggle}
          className="text-white focus:outline-none"
          title="Expandir/Contraer"
        >
          {open ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      <nav className="flex-1 space-y-6">
        {sections.map((section, si) => {
          // Determina si la sección completa debe ser visible
          let showSection = false;
          if (section.items) {
            // Si tiene sub-ítems, la sección se muestra si al menos un sub-ítem es visible
            showSection = section.items.some(item =>
              (item.permission && hasPermission(item.permission)) ||
              (item.roles && isInAllowedRoles(item.roles)) ||
              (!item.permission && !item.roles) // Si no hay permiso/rol específico, se muestra por defecto (asume autenticado)
            );
          } else {
            // Si es un ítem de nivel superior (como 'Inicio'), verifica sus propios permisos/roles
            showSection =
              (section.permission && hasPermission(section.permission)) ||
              (section.roles && isInAllowedRoles(section.roles)) ||
              (!section.permission && !section.roles); // Si no hay permiso/rol específico, se muestra por defecto
          }

          // Solo renderiza la sección si showSection es true
          return (
            showSection && (
              <div key={si}>
                {section.items ? (
                  <>
                    <h4
                      className={`text-sm font-semibold text-texto-secundario mb-2 text-[#D1D1D0] ${
                        open ? '' : 'sr-only'
                      }`}
                    >
                      {section.title}
                    </h4>
                    <ul className="space-y-1">
                      {section.items.map((item, i) => {
                        // Decide si mostrar el item del sub-menú
                        const showItem =
                          (item.permission && hasPermission(item.permission)) ||
                          (item.roles && isInAllowedRoles(item.roles)) ||
                          (!item.permission && !item.roles); // Si no requiere permiso ni rol, se muestra por defecto

                        const isActive = pathname === item.path;
                        const IconSVG = isActive ? item.activeIcon : item.icon;

                        return (
                          showItem && ( // Solo renderiza el <li> si showItem es true
                            <li key={i}>
                              <Link
                                to={item.path}
                                className={`flex items-center px-2 py-3 rounded hover:bg-gray-700 transition ${
                                  isActive ? 'bg-[#333333]' : '' // Agregué un fondo sutil para el activo
                                }`}
                              >
                                <img
                                  src={IconSVG}
                                  alt={item.title}
                                  className="w-6 h-6 flex-shrink-0"
                                />
                                {open && (
                                  <span
                                    className={`ml-3 text-base whitespace-nowrap ${
                                      isActive ? 'text-[#FFC800]' : 'text-gray-300'
                                    }`}
                                  >
                                    {item.title}
                                  </span>
                                )}
                              </Link>
                            </li>
                          )
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  // Si es un ítem de nivel superior sin sub-ítems
                  <Link
                    to={section.path}
                    className={`flex items-center px-2 py-1 rounded font-semibold hover:bg-gray-700 transition ${
                      pathname === section.path ? 'text-[#FFC800]' : 'text-gray-300'
                    }`}
                  >
                    <img
                      src={section.activeIcon || section.icon} // Usa activeIcon si existe, si no, el normal
                      alt={section.title}
                      className="w-5 h-5 flex-shrink-0"
                    />
                    {open && <span className="ml-3">{section.title}</span>}
                  </Link>
                )}
              </div>
            )
          );
        })}
      </nav>
    
    </aside>
  );
}