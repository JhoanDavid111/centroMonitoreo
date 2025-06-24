module.exports = {
  apps: [
    {
      name: 'centro-monitoreo',
      script: 'node_modules/vite/bin/vite.js',
      args: '--host',
      interpreter: 'node',
      cwd: 'C:/centroMonitoreo',
      watch: false
    }
  ]
}