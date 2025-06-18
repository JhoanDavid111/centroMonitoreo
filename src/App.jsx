import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { IndicadoresResumen } from './components/IndicadoresResumen';
import { EnergiaElectrica } from './components/EnergiaElectrica';
import { MapaEmbalses } from './components/MapaEmbalses';
import { CombustiblesLiquidos } from './components/CombustiblesLiquidos';
import { TablaProyectosEnergia } from './components/TablaProyectosEnergia';
import { Banner6GW } from './components/Banner6GW';
import { Routes, Route, Navigate } from 'react-router-dom';
import Resumen from './pages/resumen';
import Proyectos from './pages/Proyectos075';
import ComunidadesEnergeticas from './pages/EnergiaElectricaPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthButton from './components/AuthButton';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Pantalla de carga mientras verifica autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d1d1d]">
        <div className="text-white">Cargando aplicación...</div>
      </div>
    );
  }

  // Mostrar pantalla de login si no está autenticado
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#262626] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthButton />
        </div>
      </div>
    );
  }

  // Contenido principal cuando está autenticado
  return (
    <div className="relative">
      <Header />
      
      <div className="flex bg-[#1d1d1d] min-h-screen pt-20">
        <Sidebar
          open={sidebarOpen}
          toggle={() => setSidebarOpen(prev => !prev)}
        />

        <div className="flex-1 text-white p-6 overflow-auto">
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <>
                  <Banner6GW />
                  <IndicadoresResumen />
                  <EnergiaElectrica />
                  <MapaEmbalses />
                  <CombustiblesLiquidos />
                  <TablaProyectosEnergia />
                </>
              </PrivateRoute>
            } />
            
            <Route path="/6GW+" element={<PrivateRoute><Resumen /></PrivateRoute>} />
            <Route path="/proyectos075" element={<PrivateRoute><Proyectos /></PrivateRoute>} />
            <Route path="/comunidades_energeticas" element={<PrivateRoute><ComunidadesEnergeticas /></PrivateRoute>} />
            
            <Route
              path="/estrategia-6gw"
              element={
                <PrivateRoute>
                  <div className="text-white p-6">
                    <h2 className="text-2xl font-bold mb-4">Estrategia 6GW</h2>
                    <p>Aquí iría el contenido detallado de tu estrategia…</p>
                  </div>
                </PrivateRoute>
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