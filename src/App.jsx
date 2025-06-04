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
import Proyectos from './pages/Proyectos075';
import ComunidadesEnergeticas from './pages/EnergiaElectricaPage';
import { AuthProvider, useAuth } from './context/AuthForm';
import AuthFormScreen from './components/AuthFormScreen';

function AppContent() {
  const { step } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mostrar pantalla de autenticación hasta que esté autenticado
  if (step !== 'authenticated') {
    return <AuthFormScreen />;
  }

  return (
    <div className="relative">
      {/* Header fijo */}
      <Header />

      {/* Contenedor principal */}
      <div className="flex bg-[#1d1d1d] min-h-screen pt-20">
        <Sidebar
          open={sidebarOpen}
          toggle={() => setSidebarOpen(prev => !prev)}
        />

        <div className="flex-1 text-white p-6 overflow-auto">
          <Routes>
            {/* Ruta principal */}
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
            <Route path="/6GW" element={<Resumen />} />
            <Route path="/proyectos075" element={<Proyectos />} />
            <Route path="/comunidades_energeticas" element={<ComunidadesEnergeticas />} />
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

