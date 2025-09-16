// src/components/SSO/SSOTestButton.jsx
// Este es un componente de prueba para demostrar la funcionalidad SSO
// Se puede usar temporalmente para probar el SSO antes de la implementación completa

import React, { useState } from 'react';
import { useSSO } from '../../hooks/useSSO';

const SSOTestButton = ({ url, label = "Probar SSO" }) => {
  const { navigateWithSSO, canUseSSO, isAuthenticated } = useSSO();
  const [selectedMethod, setSelectedMethod] = useState('post');

  const handleTestSSO = (method) => {
    if (!isAuthenticated) {
      alert('Debe estar autenticado para usar SSO');
      return;
    }

    if (!canUseSSO()) {
      alert('Usuario no tiene permisos para usar SSO');
      return;
    }

    navigateWithSSO(url, { method });
  };

  const methods = [
    { value: 'mattermost-oauth', label: 'Mattermost OAuth', description: 'OAuth2 con Google (Recomendado)' },
    { value: 'mattermost-jwt', label: 'Mattermost JWT', description: 'Token JWT personalizado' },
    { value: 'mattermost-api', label: 'Mattermost API', description: 'Login directo por API' },
    { value: 'post', label: 'POST (Genérico)', description: 'Para otros sistemas - POST seguro' },
    { value: 'url', label: 'URL (Testing)', description: 'Solo para desarrollo y pruebas' }
  ];

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Prueba de SSO</h3>
      <p className="text-sm text-gray-600 mb-3">
        URL de destino: <code className="bg-gray-200 px-1 rounded">{url}</code>
      </p>
      
      <div className="mb-3 text-sm">
        <p>Estado de autenticación: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
          {isAuthenticated ? '✓ Autenticado' : '✗ No autenticado'}
        </span></p>
        <p>Puede usar SSO: <span className={canUseSSO() ? 'text-green-600' : 'text-red-600'}>
          {canUseSSO() ? '✓ Sí' : '✗ No'}
        </span></p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Método SSO:</label>
        <select 
          value={selectedMethod} 
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          {methods.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label} - {method.description}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {methods.map((method) => (
          <button
            key={method.value}
            onClick={() => handleTestSSO(method.value)}
            disabled={!isAuthenticated}
            className={`px-3 py-2 rounded text-sm font-medium ${
              !isAuthenticated
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : method.value === 'mattermost-oauth'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : method.value === 'mattermost-jwt'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : method.value === 'mattermost-api'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : method.value === 'post'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={method.description}
          >
            {method.label}
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p><strong>Para Mattermost:</strong> OAuth es el método más fácil, API el más potente</p>
        <p><strong>Para otros sistemas:</strong> POST para producción</p>
      </div>
    </div>
  );
};

export default SSOTestButton;
