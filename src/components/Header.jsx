import {
    HelpCircleIcon,
    LogOutIcon,
    MenuIcon,
    UserIcon,
    XIcon,
} from "lucide-react";
import { useState } from "react";
import energiaLogo from "../assets/logosEnergiaUpme.svg";
import { useAuth } from "../context/AuthContext";


import { useSidebar } from "./Sidebar";

export function Header() {
  const { open, setOpen } = useSidebar();
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-24 bg-[#262626] border-b border-[#575756] flex items-center justify-between px-6 z-50">
      {/* Logos + título */}
      <div className="flex items-center w-1/2">
        <img
          src={energiaLogo}
          alt="Ministerio de Energía"
          className="h-16 w-auto"
        />
        <div className="h-12 border-l border-[#575756] ml-[100px] mr-7" />
        <h1
          className="text-white hidden md:inline"
          style={{
            fontFamily: '"Nunito Sans", sans-serif',
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: "36px",
          }}
        >
          Centro de Monitoreo
        </h1>
      </div>

      {/* Iconos de la derecha */}
      <div className="flex items-center space-x-6">
        {open ? (
          <button onClick={() => setOpen(false)}>
            <XIcon
              size={28}
              className="text-white cursor-pointer hover:text-gray-300 block md:hidden"
              title="Abrir Menú"
            />
          </button>
        ) : (
          <button onClick={() => setOpen(true)}>
            <MenuIcon
              size={28}
              className="text-white cursor-pointer hover:text-gray-300 block md:hidden"
              title="Abrir Menú"
            />
          </button>
        )}

        <HelpCircleIcon
          size={28}
          className="text-white cursor-pointer hover:text-gray-300 hidden md:block"
          title="Ayuda"
        />

        {/* Menú de usuario */}
        {currentUser && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <UserIcon
                size={28}
                className="text-white cursor-pointer hover:text-gray-300"
                title="Usuario"
              />
              <span className="text-white text-sm hidden md:inline-block">
                {currentUser.displayName || currentUser.email?.split("@")[0]}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1d1d1d] rounded-md shadow-lg border border-[#575756] z-50">
                <div className="px-4 py-3 border-b border-[#575756]">
                  <p className="text-sm text-white font-medium">
                    {currentUser.displayName || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-300 truncate">
                    {currentUser.email}
                  </p>
                </div>
                <button
                  onClick={async () => {await logout()}}
                  className="w-full px-4 py-2 text-sm text-white hover:bg-[#FFC800] hover:text-black flex items-center space-x-2"
                >
                  <LogOutIcon size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
