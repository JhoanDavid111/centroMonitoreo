# 1. Usa una imagen base con Node
FROM node:18 AS build

# 2. Establece el directorio de trabajo
WORKDIR /app

# 3. Copia archivos del proyecto
COPY package*.json ./
COPY vite.config.js ./
COPY . .

# 4. Instala dependencias y compila la app
RUN npm install
RUN npm run build

# 5. Usa una imagen más liviana para servir los archivos
FROM nginx:alpine

# 6. Copia los archivos compilados al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 7. Copia un archivo de configuración personalizado (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# 8. Expone el puerto 80
EXPOSE 80

# 9. Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
