import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { IndicadoresResumen } from './components/IndicadoresResumen';
import { EnergiaElectrica } from './components/EnergiaElectrica';
import { MapaEmbalses } from './components/MapaEmbalses';
import { CombustiblesLiquidos } from './components/CombustiblesLiquidos';
import { TablaProyectosEnergia } from './components/TablaProyectosEnergia';
import { Banner6GW } from './components/Banner6GW';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Resumen from './pages/resumen';
import Proyectos from './pages/Proyectos075';
import ComunidadesEnergeticas from './pages/EnergiaElectricaPage';
import EnConstruccion from './pages/EnConstruccion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ManualAuthProvider, useManualAuth } from './context/ManualAuthContext';
import { AuthButton, PrivateRoute } from './components/auth';

function AppContent() {
  const { currentUser, loading: authLoading } = useAuth();
  const { manualAuth, loading: manualAuthLoading } = useManualAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const loading = authLoading || manualAuthLoading;
  const isAuthenticated = currentUser || manualAuth.isAuthenticated;

  // Pantalla de carga mejorada
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d1d1d]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC800] mb-4"></div>
          <p className="text-white">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Mostrar pantalla de login si no está autenticado
  if (!isAuthenticated) {
    // Si estamos en una ruta protegida, mostrar solo el AuthButton centrado
    const isProtectedRoute = !['/', '/login'].includes(location.pathname);
    
    return (
      <div className="min-h-screen bg-[#262626] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthButton />
          {isProtectedRoute && (
            <p className="mt-4 text-sm text-red-500 text-center">
              Debes iniciar sesión para acceder a esta página
            </p>
          )}
        </div>
      </div>
    );
  }

  // Verificación adicional del email (segunda capa de protección)
  const isGoogleAuthorized = currentUser && (
    currentUser.email?.endsWith('@upme.gov.co') || 
    currentUser.email?.endsWith('@minenergia.gov.co')
  );

  const isMicrosoftAuthorized = manualAuth.isAuthenticated;

  if (!isGoogleAuthorized && !isMicrosoftAuthorized) {
    return (
      <div className="min-h-screen bg-[#262626] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthButton />
          <p className="mt-4 text-sm text-red-500 text-center">
            Solo cuentas institucionales autorizadas permitidas
          </p>
        </div>
      </div>
    );
  }

  // Contenido principal cuando está autenticado y autorizado
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
              <>
                <Banner6GW />
                <IndicadoresResumen />
                <EnergiaElectrica />
                <MapaEmbalses />
                <CombustiblesLiquidos />
                <TablaProyectosEnergia />
              </>
            } />
            
            <Route path="/6GW+" element={<Resumen />} />
            <Route path="/proyectos075" element={<Proyectos />} />
            <Route path="/comunidades_energeticas" element={<ComunidadesEnergeticas />} />
            <Route path="/en_construccion" element={<EnConstruccion />} />
            
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
      <ManualAuthProvider>
        <Routes>
          <Route path="/*" element={<AppContent />} />
          <Route path="/login" element={
            <div className="min-h-screen bg-[#262626] flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-md">
                <AuthButton />
              </div>
            </div>
          } />
        </Routes>
      </ManualAuthProvider>
    </AuthProvider>
  );
}