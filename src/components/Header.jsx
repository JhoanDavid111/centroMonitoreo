import energiaLogo from '../assets/logosEnergiaUpme.svg';
import { HelpCircle, Moon, User } from 'lucide-react';

export function Header() {
  return (
    <header
      className="
        fixed top-0 left-0 right-0
        h-20
        bg-[#262626] border-b border-[#575756]
        flex items-center justify-between
        px-6
        z-50
      "
    >
      {/* Logos + título a la izquierda */}
      <div className="flex items-center">
        {/* Logo Ministerio de Energía */}
        <img
          src={energiaLogo}
          alt="Ministerio de Energía"
          className="h-16 w-auto"
        />
        {/* Separador vertical */}
        <div className="h-12 border-l border-[#575756] mx-6" />

        {/* Título */}
        <h1
          className="text-white"
          style={{
            fontFamily: '"Nunito Sans", sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '36px',
          }}
        >
          Centro de Monitoreo
        </h1>
      </div>

      {/* Iconos de la derecha */}
      <div className="flex items-center space-x-6">
        <HelpCircle
          size={28}
          className="text-white cursor-pointer hover:text-gray-300"
          title="Ayuda"
        />
        <Moon
          size={28}
          className="text-white cursor-pointer hover:text-gray-300"
          title="Modo oscuro"
        />
        <User
          size={28}
          className="text-white cursor-pointer hover:text-gray-300"
          title="Usuario"
        />
      </div>
    </header>
  );
}