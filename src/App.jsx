// File: src/App.jsx

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { IndicadoresResumen } from './components/IndicadoresResumen';
import { EnergiaElectrica } from './components/EnergiaElectrica';
import { MapaEmbalses } from './components/MapaEmbalses';
import { CombustiblesLiquidos } from './components/CombustiblesLiquidos';
import { TablaProyectosEnergia } from './components/TablaProyectosEnergia';
import { Banner6GW } from './components/Banner6GW';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Resumen from './pages/resumen';
import Proyectos from './pages/Proyectos075';
import ComunidadesEnergeticas from './pages/EnergiaElectricaPage';
import { AuthProvider, useAuth } from './context/AuthContext'; // Cambiado a AuthContext
import AuthButton from './components/AuthButton'; // Nuevo componente de autenticación

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d1d1d]">
        <div className="text-white">Cargando aplicación...</div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-[#262626] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthButton /> {/* Componente de autenticación con Google */}
        </div>
      </div>
    );
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
            <Route path="/6GW+" element={<Resumen />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
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