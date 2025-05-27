// src/App.jsx
import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { IndicadoresResumen } from './components/IndicadoresResumen';
import { EnergiaElectrica } from './components/EnergiaElectrica';
import { MapaEmbalses } from './components/MapaEmbalses';
import { CombustiblesLiquidos } from './components/CombustiblesLiquidos';
import { TablaProyectosEnergia } from './components/TablaProyectosEnergia';
import { Routes, Route } from 'react-router-dom';
import Resumen from './pages/resumen';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar
        open={sidebarOpen}
        toggle={() => setSidebarOpen(prev => !prev)}
      />

      <div className="flex-1 text-white p-6">
        <Header />

        <Routes>
          {/* Ruta principal: sin banner */}
          <Route
            path="/"
            element={
              <>
                <IndicadoresResumen />
                <EnergiaElectrica />
                <MapaEmbalses />
                <CombustiblesLiquidos />
                <TablaProyectosEnergia />
              </>
            }
          />

          {/* Ruta “Resumen”: */}
          <Route path="/6GW" element={<Resumen />} />

          {/* Ruta de estrategia 6GW (desde el botón “Consultar” del banner) */}
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
  );
}
