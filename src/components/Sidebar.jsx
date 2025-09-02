import { useState, useEffect } from "react";
import { useMobile } from '../hooks/use-mobile';

import {  ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES, ROLE_PERMISSIONS } from '../config/roles';

import GWOff from '../assets/svg-icons/6GW-off-act.svg';
import GWOn from '../assets/svg-icons/6GW-on-act.svg';
import ComunidadesEnergOff from '../assets/svg-icons/ComunidadesEnerg-Off.svg';
import ComunidadesEnergOn from '../assets/svg-icons/ComunidadesEnerg-On.svg';
import Proyecto075Off from '../assets/svg-icons/Proyecto075-Off.svg';
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg';
import AccionesEstrategicasOff from '../assets/svg-icons/AccionesEstrategicas-Off.svg';
import AccionesEstrategicasOn from '../assets/svg-icons/AccionesEstrategicas-On.svg';
import ProyectosTransmisionOn from '../assets/svg-icons/Transmision-On.svg';
import ProyectosTransmisionOff from '../assets/svg-icons/Transmision-Off.svg';

import HidroOff from '../assets/svg-icons/Hidrologia-Off.svg';
import HidroOn  from '../assets/svg-icons/Hidrologia-On.svg';
import EnergiaFirmeOff from '../assets/svg-icons/EnergiaElectrica-Off.svg';
import EnergiaFirmeOn  from '../assets/svg-icons/EnergiaElectrica-On.svg';

const WIDTHS = {
  open: "18rem",
  closed: "4.5rem",
}

 const sections = [
   /*  {
      title: 'Inicio',
      path: '/',
      icon: DashboardOff,
      activeIcon: DashboardOn,
      permission: 'dashboard',
    }, */
   {
     title: "Seguimiento plan 6GW+",
     items: [
       {
         title: "Resumen",
         path: "/6GW+",
         icon: GWOff,
         activeIcon: GWOn,
         permission: "dashboard",
       },
       {
         title: "Proyectos de Generación",
         path: "/proyectos_generacion",
         icon: Proyecto075Off,
         activeIcon: Proyecto075On,
         permission: "proyectos",
       },
       {
         title: "Transmisión",
         path: "/Transmision",
         icon: ProyectosTransmisionOff,
         activeIcon: ProyectosTransmisionOn,
         roles: [ROLES.ADMIN],
       },
       {
         title: "Comunidades energéticas",
         path: "/en_construccion",
         icon: ComunidadesEnergOff,
         activeIcon: ComunidadesEnergOn,
         permission: "comunidades",
       },
       {
         title: "Acciones 6GW+",
         path: "http://192.168.1.74:8065/boards/",
         icon: AccionesEstrategicasOff,
         activeIcon: AccionesEstrategicasOn,
         roles: [ROLES.ADMIN],
         external: true,
       },
     ],
   },
   {
     title: "Abastecimiento",
     items: [
       {
         title: "Hidrología",
         path: "/hidrologia",
         icon: HidroOff,
         activeIcon: HidroOn,
         permission: "dashboard", 
       },
       {
         title: "Energía firme",
         path: "/en_construccion",
         icon: EnergiaFirmeOff,
         activeIcon: EnergiaFirmeOn,
         permission: "dashboard",
       },
     ],
   },
 ];

export function Sidebar({ userRole }) {
  const [open, setOpen] = useState(true);

  const { isMobile } = useMobile();

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile, setOpen]);

  // -------- helpers de permisos/roles --------
  const hasPermission = (permission) => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) return false;
    const userPermissions = ROLE_PERMISSIONS[userRole];
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
  };

  const isInAllowedRoles = (allowedRolesArray) => {
    if (!userRole) return false;
    if (!allowedRolesArray || allowedRolesArray.length === 0) return true;
    return allowedRolesArray.includes(userRole);
  };

  return (
    <aside
      className="bg-[#262626] font-sans py-2 sticky top-24 text-gray-300 h-[calc(100vh-6rem)] overflow-y-auto flex flex-col transition-all duration-300"
      style={{
        width: open ? WIDTHS.open : WIDTHS.closed,
      }}
    >
      {/* Botón toggle */}
      <div data-state={open ? "open" : "closed"} className="flex justify-end mb-2 px-4 py-2 w-full data-[state=closed]:justify-center">
        <button onClick={() => {setOpen((prev) => !prev)}} className="group hover:bg-gray-500/50 hover:border-gray-500/70 transition-all duration-100 size-8 flex items-center justify-center" title={
          open ? 'Contraer' : 'Expandir'
        }>
          <ChevronRight size={24} className={open ? 'rotate-180 text-gray-300 group-hover:text-white transition-all duration-100' : ''} />
        </button>
      </div>

      <nav className="flex-1 flex-col">
        <ul className="flex flex-col gap-y-6 h-full">

        {sections.map((section, index) => (
          <SidebarItem key={index} section={section} hasPermission={hasPermission} isInAllowedRoles={isInAllowedRoles} open={open} />
        ))}
        </ul>
      </nav>
    </aside>
  );
}

const SidebarItem = ({ section, hasPermission, isInAllowedRoles, open }) => {
  const { pathname } = useLocation();
  let showSection = false;

          if (section.items) {
            showSection = section.items.some((item) =>
              (item.permission && hasPermission(item.permission)) ||
              (item.roles && isInAllowedRoles(item.roles)) ||
              (!item.permission && !item.roles)
            );
          } else {
            showSection =
              (section.permission && hasPermission(section.permission)) ||
              (section.roles && isInAllowedRoles(section.roles)) ||
              (!section.permission && !section.roles);
          }

        if(!showSection) return null;

    return (
              <li
                className="w-full space-y-2 px-4"
              >
                {section.items ? (
                  <>
                    <span
                    data-state={open ? "show" : "hidden"}
                      className="text-sm font-semibold text-[#D1D1D0] mb-2 uppercase data-[state=hidden]:hidden"
                    >
                      {section.title}
                    </span>
                    <ul className="space-y-1">
                      {section.items.map((item, itemIndex) => {
                        const showItem =
                          (item.permission && hasPermission(item.permission)) ||
                          (item.roles && isInAllowedRoles(item.roles)) ||
                          (!item.permission && !item.roles);

                        const isActive = pathname === item.path;
                        const IconSVG = isActive ? item.activeIcon : item.icon;
                        return (
                          showItem && (
                            <li key={itemIndex}>
                              {item.external ? (
                                <a
                                  href={item.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center px-2 py-3 rounded hover:bg-gray-700 transition  ${
                                    isActive ? 'bg-[#333333]' : ''
                                  }`}
                                >
                                  <img src={IconSVG} alt={item.title} className="w-6 h-6 shrink-0" />
                                    <span
                                    data-state={open ? "show" : "hidden"}
                                    data-active={isActive}
                                      className="ml-3 text-base whitespace-nowrap text-gray-300 data-[active=true]:text-[#FFC800] data-[state=hidden]:hidden"
                                    >
                                      {item.title}
                                    </span>
                                </a>
                              ) : (
                                <Link
                                  to={item.path}
                                  className={`flex items-center px-2 py-3 rounded hover:bg-gray-700 transition ${
                                    isActive ? 'bg-[#333333]' : ''
                                  }`}
                                >
                                  <img src={IconSVG} alt={item.title} className="w-6 h-6 flex-shrink-0" />
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
                              )}
                            </li>
                          )
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={section.path}
                    className={`flex items-center px-2 py-1 rounded font-semibold hover:bg-gray-700 transition ${
                      pathname === section.path ? 'text-[#FFC800]' : 'text-gray-300'
                    }`}
                  >
                    <img
                      src={section.activeIcon || section.icon}
                      alt={section.title}
                      className="w-5 h-5 flex-shrink-0"
                    />
                    {open && <span className="ml-3">{section.title}</span>}
                  </Link>
                )}
              </li>
            );
}
// <3 ¯\_( ͡❛ ͜ʖ ͡❛)_/¯ js08