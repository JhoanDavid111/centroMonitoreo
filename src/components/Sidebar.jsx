import React from 'react'
import {ChevronLeft,ChevronRight} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

// Estas importaciones devuelven URLs al SVG en Vite
import DashboardOff from '../assets/svg-icons/Dashboard-Off.svg'
import DashboardOn from '../assets/svg-icons/Dashboard-On.svg'
import GWOff from '../assets/svg-icons/6GW-off.svg'
import GWOn from '../assets/svg-icons/6GW-on.svg'
import ComunidadesEnergOff from '../assets/svg-icons/ComunidadesEnerg-Off.svg'
import ComunidadesEnergOn from '../assets/svg-icons/ComunidadesEnerg-On.svg'
import AutogeneracionOff from '../assets/svg-icons/Autogeneracion-Off.svg'
import AutogeneracionOn from '../assets/svg-icons/Autogeneracion-On.svg'
import Proyecto075Off from '../assets/svg-icons/Proyecto075-Off.svg'
import Proyecto075On from '../assets/svg-icons/Proyecto075-On.svg'
import AccionesEstrategicasOff from '../assets/svg-icons/AccionesEstrategicas-Off.svg'
import AccionesEstrategicasOn from '../assets/svg-icons/AccionesEstrategicas-On.svg'
import ProyectosTransmisionOn from '../assets/svg-icons/Transmision-On.svg'
import ProyectosTransmisionOff from '../assets/svg-icons/Transmision-Off.svg'
import HidroOff from '../assets/svg-icons/Hidrologia-Off.svg'
import HidroOn from '../assets/svg-icons/Hidrologia-On.svg'
import EnergiaOff from '../assets/svg-icons/EnergiaElectrica-Off.svg'
import EnergiaOn from '../assets/svg-icons/EnergiaElectrica-On.svg'
import PreciosOff from '../assets/svg-icons/Precios-Off.svg'
import PreciosOn from '../assets/svg-icons/Precios-On.svg'
import GeneracionTermicaOff from '../assets/svg-icons/GeneracionTermica-Off.svg'
import GeneracionTermicaOn from '../assets/svg-icons/GeneracionTermica-On.svg'
import DemandaOff from '../assets/svg-icons/Demanda-Off.svg'
import DemandaOn from '../assets/svg-icons/Demanda-On.svg'
import TransmisionOff from '../assets/svg-icons/Transmision-Off.svg'
import TransmisionOn from '../assets/svg-icons/Transmision-On.svg'



export function Sidebar({ open, toggle }) {
  const { pathname } = useLocation()

  const sections = [
    {
      title: 'Inicio',
      path: '/',
      icon: DashboardOff,
      activeIcon: DashboardOn,
    },
    {
      title: 'ESTRATEGIA 6GW+',
      items: [
        {
          title: 'Resumen',
          path: '/6GW+',
          icon: GWOff,
          activeIcon: GWOn
        },
        {
          title: 'Proyectos 075',
          path: '/proyectos075',
          icon: Proyecto075Off,
          activeIcon: Proyecto075On
        },
        {
          title: 'Transmisión',
          path: '/Transmision',
          icon: ProyectosTransmisionOff,
          activeIcon: ProyectosTransmisionOn
        },
        {
          title: 'Comunidades energéticas',
          path: '/comunidades_energeticas',
          icon: ComunidadesEnergOff,
          activeIcon: ComunidadesEnergOn
        },
        {
          title: 'Acciones estratégicas',
          path: '/en_construccion',
          icon: AccionesEstrategicasOff,
          activeIcon: AccionesEstrategicasOn
        },
        /* 
        {
          title: 'Autogeneración y GD',
          path: '/en_construccion',
          icon: AutogeneracionOff,
          activeIcon: AutogeneracionOn
        },
        */
      ]
    },
    /*{
      title: 'ABASTECIMIENTO',
      items: [
        {
          title: 'Hidrología',
          path: '/en_construccion',
          icon: HidroOff,
          activeIcon: HidroOn
        },
        {
          title: 'Suficiencia energética',
          path: '/en_construccion',
          icon: EnergiaOff,
          activeIcon: EnergiaOn
        },
        {
          title: 'Precios',
          path: '/en_construccion',
          icon: PreciosOff,
          activeIcon: PreciosOn
        },
        {
          title: 'Generación térmica',
          path: '/en_construccion',
          icon: GeneracionTermicaOff,
          activeIcon: GeneracionTermicaOn
        },
        {
          title: 'Demanda',
          path: '/en_construccion',
          icon: DemandaOff,
          activeIcon: DemandaOn
        }
      ]
    }, */
    /*{
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
    } */
  ]

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
        {sections.map((section, si) => (
          <div key={si}>
            {section.items ? (
              <>
                <h4
                  className={`text-sm font-semibold text-texto-secundario mb-2 text-[#D1D1D0] ${
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
                          className={`flex items-center px-2 py-3 rounded hover:bg-gray-700 transition ${
                            isActive ? '' : ''
                          }`}>
                          <img
                            src={IconSVG}
                            alt={item.title}
                            className="w-6 h-6 flex-shrink-0"
                          />
                          {open && (
                            <span
                              className={`ml-3 text-base whitespace-nowrap ${
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
  