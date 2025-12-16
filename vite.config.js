// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Carga variables .env (sin prefijo para leer VITE_* tal cual)
  const env = loadEnv(mode, process.cwd(), '');

  // Host del API (puedes ponerlo en .env como VITE_API_TARGET)
  const API_TARGET = env.VITE_API_TARGET || 'http://192.168.8.138:8002';

  return {
    base: env.VITE_BASE || '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
      },
    },
    server: {
      host: true,                         // permite acceso en LAN si lo necesitas
      port: Number(env.VITE_PORT || 5173),
      proxy: {
        // Todo lo que empiece por /v1 lo reenvía al API_TARGET
        '/v1': {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
          // OJO: NO reescribimos la ruta porque tu backend ya expone /v1/...
          // rewrite: (p) => p, // (no necesario)
        },
      },
    },
    preview: {
      port: Number(env.VITE_PREVIEW_PORT || 4173),
    },
  };
});

