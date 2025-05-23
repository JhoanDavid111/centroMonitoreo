// src/App.jsx
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { IndicadoresResumen } from './components/IndicadoresResumen';
import { EnergiaElectrica } from './components/EnergiaElectrica';
import { MapaEmbalses } from './components/MapaEmbalses';
import { CombustiblesLiquidos } from './components/CombustiblesLiquidos';
import { TablaProyectosEnergia } from './components/TablaProyectosEnergia';
import { Banner6GW } from './components/Banner6GW';  // <-- tu banner
import { Routes, Route, useNavigate } from 'react-router-dom';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar open={sidebarOpen} toggle={() => setSidebarOpen(prev => !prev)} />

      <div className="flex-1 text-white p-6">
        <Header />

        {/* Aquí incluimos el banner */}
        <Banner6GW onClick={() => navigate('/estrategia-6gw')} />

        <Routes>
          <Route path="/" element={
            <>
              <IndicadoresResumen />
              <EnergiaElectrica />
              <MapaEmbalses />
              <CombustiblesLiquidos />
              <TablaProyectosEnergia />
            </>
          }/>
          {/* Si en algún momento necesitas la ruta, la defines: */}
          <Route path="/estrategia-6gw" element={
            <div className="text-white p-6">
              <h2 className="text-2xl font-bold mb-4">Estrategia 6GW</h2>
              <p>Contenido de tu estrategia aquí…</p>
            </div>
          }/>
        </Routes>
      </div>
    </div>
  );
}
