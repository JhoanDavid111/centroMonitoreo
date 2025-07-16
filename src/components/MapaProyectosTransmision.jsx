import React from 'react';

const MapaProyectosTransmision = () => {
  return (
    <div className="px-2 mt-8">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        Mapa de Proyectos de Transmisión
      </h2>
      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow">
        <iframe 
          src="https://sig.upme.gov.co/portal/apps/experiencebuilder/experience/?id=75a09b50640c461a9d32ff4aa9eb4028" 
          title="Mapa de Proyectos de Transmisión"
          className="w-full h-[600px] border-none rounded-md"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default MapaProyectosTransmision;