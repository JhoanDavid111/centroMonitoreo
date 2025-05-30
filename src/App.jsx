// src/App.jsx
import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { IndicadoresResumen } from './components/IndicadoresResumen';
import { EnergiaElectrica } from './components/EnergiaElectrica';
import { MapaEmbalses } from './components/MapaEmbalses';
import { CombustiblesLiquidos } from './components/CombustiblesLiquidos';
import { TablaProyectosEnergia } from './components/TablaProyectosEnergia';
import { Banner6GW } from './components/Banner6GW';
import { Routes, Route } from 'react-router-dom';
import Resumen from './pages/resumen';
import Proyectos from './pages/Proyectos075'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative">
      {/* Header fijo */}
      <Header />

      {/* Contenedor principal: empujado hacia abajo para dejar espacio al header */}
      <div className="flex bg-[#1d1d1d] min-h-screen pt-20">
        <Sidebar
          open={sidebarOpen}
          toggle={() => setSidebarOpen(prev => !prev)}
        />

        <div className="flex-1 text-white p-6 overflow-auto">
          <Routes>
            {/* Ruta principal: con banner */}
            <Route
              path="/"
              element={
                <>
                  <Banner6GW />
                  <IndicadoresResumen />
                  <EnergiaElectrica />
                  <MapaEmbalses />
                  <CombustiblesLiquidos />
                  <TablaProyectosEnergia />
                </>
              }
            />

            {/* Ruta “Resumen” */}
            <Route path="/6GW" element={<Resumen />} />
            <Route path="/proyectos075" element={<Proyectos />} />

            {/* Ruta de estrategia 6GW */}
            <Route
              path="/estrategia-6gw"
              element={
                <div className="text-white p-6">
                  <h2 className="text-2xl font-bold mb-4">Estrategia 6GW</h2>
                  <p>Aquí iría el contenido detallado de tu estrategia…</p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
