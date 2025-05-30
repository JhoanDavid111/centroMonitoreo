import React from 'react'
import {
  LayoutDashboard,
  Droplet,
  Zap,
  Sun,
  Flame,
  TrendingUp,
  Thermometer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

// Estas importaciones devuelven URLs al SVG en Vite
import HidroOn from '../assets/hidrologia-on.svg'
import HidroOff from '../assets/hidrologia-off.svg'
import EnergiaOn from '../assets/EnergiaElectrica-on.svg'
import EnergiaOff from '../assets/EnergiaElectrica-off.svg'
import PreciosOn from '../assets/precios-on.svg'
import PreciosOff from '../assets/precios-off.svg'
import TermicaOn from '../assets/termica-on.svg'
import TermicaOff from '../assets/termica-off.svg'
import DemandaOn from '../assets/Demanda-on.svg'
import DemandaOff from '../assets/Demanda-off.svg'
import CombustiblesOn from '../assets/Gasolina-on.svg'
import CombustiblesOff from '../assets/Gasolina-off.svg'
import GasOn from '../assets/gas-on.svg'
import GasOff from '../assets/gas-off.svg'
import GLPOn from '../assets/GLP-on.svg'
import GLPOff from '../assets/GLP-off.svg'
import GWOn from '../assets/6GW-on.svg'
import GWOff from '../assets/6GW-off.svg'
import DashboardOn from '../assets/Dashboard-on.svg'
import DashboardOff from '../assets/Dashboard-off.svg'

export function Sidebar({ open, toggle }) {
  const { pathname } = useLocation()

  const sections = [
    {
      title: 'Inicio',
      path: '/',
      icon: DashboardOff,
      activeIcon: DashboardOn
    },
    {
      title: 'ESTRATEGIA 6GW',
      items: [
        {
          title: 'Resumen',
          path: '/6GW',
          icon: GWOff,
          activeIcon: GWOn
        },
        {
          title: 'Comunidades energéticas',
          path: '/comunidades_energeticas',
          icon: GasOff,
          activeIcon: GasOn
        },
        {
          title: 'Autogeneración y GD',
          path: '/autogeneracion',
          icon: GLPOff,
          activeIcon: GLPOn
        },
        {
          title: 'Proyectos075',
          path: '/proyectos075',
          icon: CombustiblesOff,
          activeIcon: CombustiblesOn
        },
        {
          title: 'Acciones estratégicas',
          path: '/acciones_estrategicas',
          icon: TermicaOff,
          activeIcon: TermicaOn
        }
      ]
    },
    {
      title: 'ABASTECIMIENTO',
      items: [
        {
          title: 'Hidrología',
          path: '/hidrologia',
          icon: HidroOff,
          activeIcon: HidroOn
        },
        {
          title: 'Suficiencia energética',
          path: '/suficiencia',
          icon: EnergiaOff,
          activeIcon: EnergiaOn
        },
        {
          title: 'Precios',
          path: '/precios',
          icon: PreciosOff,
          activeIcon: PreciosOn
        },
        {
          title: 'Generación térmica',
          path: '/generacion',
          icon: TermicaOff,
          activeIcon: TermicaOn
        },
        {
          title: 'Demanda',
          path: '/demanda',
          icon: DemandaOff,
          activeIcon: DemandaOn
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
          activeIcon: CombustiblesOn
        },
        {
          title: 'Gas Natural',
          path: '/gas-natural',
          icon: GasOff,
          activeIcon: GasOn
        },
        {
          title: 'GLP',
          path: '/GLP',
          icon: GLPOff,
          activeIcon: GLPOn
        }
      ]
    }
  ]

  return (
    <aside
      className={`bg-[#262626] font-sans text-gray-300 h-screen overflow-y-auto flex flex-col transition-all duration-300 ${
        open ? 'w-60 p-4' : 'w-16 p-2'
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
        {sections.map((section, si) => (
          <div key={si}>
            {section.items ? (
              <>
                <h4
                  className={`text-xs font-semibold text-gray-400 mb-2 ${
                    open ? '' : 'sr-only'
                  }`}>
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item, i) => {
                    const isActive = pathname === item.path
                    const IconSVG = isActive ? item.activeIcon : item.icon
                    return (
                      <li key={i}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-2 py-1 rounded hover:bg-gray-700 transition ${
                            isActive ? '' : ''
                          }`}>
                          <img
                            src={IconSVG}
                            alt={item.title}
                            className="w-5 h-5 flex-shrink-0"
                          />
                          {open && (
                            <span
                              className={`ml-3 text-sm whitespace-nowrap ${
                                isActive ? 'text-[#FFC800]' : 'text-gray-300'
                              }`}>
                              {item.title}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
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
                src={section.icon}
                alt={section.title}
                className="w-5 h-5 flex-shrink-0"
              />
              {open && <span className="ml-3">{section.title}</span>}
            </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
  