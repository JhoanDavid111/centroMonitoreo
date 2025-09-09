// src/components/MapaProyectosTransmision.jsx
import { useState } from 'react';

export default function MapaProyectosTransmision({ mapUrl, title = "Mapa del Proyecto" }) {
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (iframeError) {
    return (
      <div className="px-2 mt-8 w-full">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          {title}
        </h2>
        <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow">
          <div className="w-full h-[600px] rounded-md bg-[#333333] flex items-center justify-center flex-col">
            <p className="text-lg text-gray-300 mb-4">No se puede cargar el mapa embebido</p>
            <button
              onClick={() => window.open(mapUrl, '_blank', 'noopener,noreferrer')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Abrir mapa en nueva ventana
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 mt-8 w-full">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        {title}
      </h2>
      <div className="bg-[#262626] p-4 rounded-lg border border-[#666666] shadow relative">
        {isLoading && (
          <div className="absolute inset-4 bg-[#333333] rounded-md flex items-center justify-center">
            <p className="text-gray-300">Cargando mapa...</p>
          </div>
        )}
        
        <iframe 
          src={mapUrl} 
          title={title}
          className="w-full h-[600px] border-none rounded-md"
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIframeError(true);
            setIsLoading(false);
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};