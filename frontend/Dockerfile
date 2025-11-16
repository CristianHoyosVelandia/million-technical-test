# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

# Remover archivos por defecto de nginx
RUN rm -rf ./*

# Copiar los archivos build
COPY --from=build /app/dist .

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

# Comando de entrada
CMD ["nginx", "-g", "daemon off;"]
