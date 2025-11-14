import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMobile } from "../hooks/use-mobile";

import { ChevronRight, HelpCircleIcon, LogOutIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROLES, ROLE_PERMISSIONS } from "../config/roles";

import GWOff from "../assets/svg-icons/6GW-off.svg";
import GWOn from "../assets/svg-icons/6GW-on.svg";
import AccionesEstrategicasOff from "../assets/svg-icons/AccionesEstrategicas-Off.svg";
import AccionesEstrategicasOn from "../assets/svg-icons/AccionesEstrategicas-On.svg";
import ComunidadesEnergOff from "../assets/svg-icons/ComunidadesEnerg-Off.svg";
import ComunidadesEnergOn from "../assets/svg-icons/ComunidadesEnerg-On.svg";
import Proyecto075Off from "../assets/svg-icons/Proyecto075-Off.svg";
import Proyecto075On from "../assets/svg-icons/Proyecto075-On.svg";
import ProyectosTransmisionOff from "../assets/svg-icons/Transmision-Off.svg";
import ProyectosTransmisionOn from "../assets/svg-icons/Transmision-On.svg";
// comentario prueba
import EnergiaFirmeOff from "../assets/svg-icons/EnergiaElectrica-Off.svg";
import EnergiaFirmeOn from "../assets/svg-icons/EnergiaElectrica-On.svg";
import HidroOff from "../assets/svg-icons/Hidrologia-Off.svg";
import HidroOn from "../assets/svg-icons/Hidrologia-On.svg";

const WIDTHS = {
  open: "18rem",
  closed: "4.5rem",
};

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
                title: "Generación (GREG 075)",
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
            // {
            //     title: "Comunidades energéticas",
            //     path: "/en_construccion",
            //     icon: ComunidadesEnergOff,
            //     activeIcon: ComunidadesEnergOn,
            //     permission: "comunidades",
            // },
            {
                title: "Acciones 6GW+",
                path: "https://acciones6gw.upme.gov.co",
                icon: AccionesEstrategicasOff,
                activeIcon: AccionesEstrategicasOn,
                roles: [ROLES.ADMIN],
                external: true,
            },
            {
                title: "Seguimiento Ambiental",
                path: "seguimiento_ambiental",
                icon: GWOff,
                activeIcon: GWOn,
                permission: "dashboard",
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

export const Sidebar = ({ userRole }) => {
  const { logout } = useAuth();

  const { isMobile } = useMobile();
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [open]);

  // -------- helpers de permisos/roles --------
  const hasPermission = (permission) => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) return false;
    const userPermissions = ROLE_PERMISSIONS[userRole];
    if (userPermissions.includes("*")) return true;
    return userPermissions.includes(permission);
  };

  const isInAllowedRoles = (allowedRolesArray) => {
    if (!userRole) return false;
    if (!allowedRolesArray || allowedRolesArray.length === 0) return true;
    return allowedRolesArray.includes(userRole);
  };

  return isMobile ? (
    <>
      <div
        data-state={open ? "open" : "closed"}
        className="fixed top-0 right-0 w-screen h-screen data-[state=open]:bg-black/75 bg-transparent transition-all duration-300 z-40 data-[state=open]:backdrop-blur-sm data-[state=closed]:-z-10"
      />
      <aside
        data-state={open ? "open" : "closed"}
        className="fixed top-24 right-0 w-[70vw] h-[calc(100vh-6rem)] bg-[#262626] data-[state=closed]:translate-x-full overflow-y-auto transition-all duration-300 z-50 border-l border-gray-600"
      >
        <nav className="flex-1 flex-col py-6 h-full">
          <ul className="flex flex-col gap-y-6 mb-auto">
            {sections.map((section, index) => (
              <SidebarItem
                key={index}
                section={section}
                hasPermission={hasPermission}
                isInAllowedRoles={isInAllowedRoles}
                open={open}
              />
            ))}
          </ul>

          <ul className="flex flex-col gap-y-6 mt-auto pt-6">
            <li className="w-full px-4">
              <button
                className="flex items-center px-2 py-3 gap-x-3 rounded hover:bg-[#374151] transition text-[#d1d5db] w-full"
                title="Ayuda"
              >
                <HelpCircleIcon
                  size={24}
                  className="w-6 h-6 flex-shrink-0 "
                />
                <span>Ayuda</span>
              </button>
            </li>

            <li className="w-full px-4">
              <button
                className="flex items-center px-2 py-3 gap-x-3 rounded hover:bg-[#410f00] transition text-[#d1d5db] w-full"
                title="Cerrar sesión"
                onClick={async () => {
                  await logout();
                }}
              >
                <LogOutIcon
                  size={24}
                  className="w-6 h-6 flex-shrink-0"
                />
                <span>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  ) : (
    <aside
      className="bg-[#262626] font-sans py-2 sticky top-24 text-gray-300 h-[calc(100vh-6rem)] overflow-y-auto flex flex-col transition-all duration-100"
      style={{
        width: open ? WIDTHS.open : WIDTHS.closed,
      }}
    >
      {/* Botón toggle */}
      <div
        data-state={open ? "open" : "closed"}
        className="flex justify-end mb-2 px-4 py-2 w-full data-[state=closed]:justify-center"
      >
        <button
          onClick={() => {
            setOpen((prev) => !prev);
          }}
          className="group hover:bg-gray-500/50 hover:border-gray-500/70 transition-all duration-100 size-8 flex items-center justify-center"
          title={open ? "Contraer" : "Expandir"}
        >
          <ChevronRight
            size={24}
            className={
              open
                ? "rotate-180 text-gray-300 group-hover:text-white transition-all duration-100"
                : ""
            }
          />
        </button>
      </div>

      <nav className="flex-1 flex-col">
        <ul className="flex flex-col gap-y-6 h-full">
          {sections.map((section, index) => (
            <SidebarItem
              key={index}
              section={section}
              hasPermission={hasPermission}
              isInAllowedRoles={isInAllowedRoles}
              open={open}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const SidebarContext = createContext({
  open: true,
  setOpen: () => {},
});

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { isMobile } = useMobile();

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile, setOpen]);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

const SidebarItem = ({ section, hasPermission, isInAllowedRoles, open }) => {
  const { setOpen } = useSidebar();
  const { isMobile } = useMobile();
  const { pathname } = useLocation();
  let showSection = false;

  if (section.items) {
    showSection = section.items.some(
      (item) =>
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

  if (!showSection) return null;

  return (
    <li className="w-full space-y-2 px-4">
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
                          isActive ? "bg-[#333333]" : ""
                        }`}
                      >
                        <img
                          src={IconSVG}
                          alt={item.title}
                          className="w-6 h-6 shrink-0"
                        />
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
                        onClick={() => {
                          if (isMobile) setOpen(false);
                        }}
                        className={`flex items-center px-2 py-3 rounded hover:bg-gray-700 transition ${
                          isActive ? "bg-[#333333]" : ""
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
                              isActive ? "text-[#FFC800]" : "text-gray-300"
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
            pathname === section.path ? "text-[#FFC800]" : "text-gray-300"
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
};
// <3 ¯\_( ͡❛ ͜ʖ ͡❛)_/¯ js08
