// src/pages/Proyectos.jsx
import React from 'react'
import BannerSeguimiento from '../components/BannerSeguimiento';
import SeguimientoBarras from '../components/SeguimientoBarras';
import ProjectGrid from '../components/ProjectGrid';
import HitosBarras from '../components/HitosBarras';



export default function Proyectos075() {
  return (
    <div className=" text-white min-h-screen font-sans">
          {/* Sección desplegable de Comunidades y Colombia Solar */}
          <BannerSeguimiento />
            <div className="p-6 bg-[#262626]">
                <SeguimientoBarras />
            </div>
            <br>
            </br>
        <div >
         <ProjectGrid />
        </div>
         <HitosBarras />
        </div>
  );
}