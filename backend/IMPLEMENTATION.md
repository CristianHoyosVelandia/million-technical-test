### Million Luxury API – Guía de Implementación

Este documento explica cómo poner en marcha el backend del proyecto Million Luxury, tanto con Docker como de forma local. Está pensado para facilitar la ejecución rápida del entorno y la validación del funcionamiento de la API.

---

## 1.  Requisitos Previos

### Para ejecución con Docker:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y corriendo
- [Docker Compose](https://docs.docker.com/compose/install/) (incluido con Docker Desktop)

### Para ejecución local:
- [.NET SDK 8.0+](https://dotnet.microsoft.com/download/dotnet/8.0)
- [MongoDB Community Server 7.0+](https://www.mongodb.com/try/download/community)
- Editor de código (VS Code, Visual Studio, Rider, etc.)

---

### 2. Verificar estructura del proyecto

```bash
backend/
├── Million.Api/              # Capa de presentación (Controllers, Middleware)
├── Million.Core/             # Entidades y DTOs
├── Million.Infrastructure/   # Repositorios y acceso a datos
├── Million.Application/      # Lógica de negocio
└── Million.Tests/            # Tests unitarios
```

---

## Ejecución con Docker (Recomendado)

Esta guía describe el proceso completo para ejecutar el backend usando Docker Compose.

### Paso 1: Construir y levantar los contenedores

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up --build
```

**¿Qué sucede internamente?**

1. **MongoDB inicia primero**:
   - Se crea el contenedor `million-mongodb` con la imagen `mongo:7`
   - MongoDB ejecuta su proceso de inicialización
   - El healthcheck verifica cada 10 segundos que MongoDB esté respondiendo
   - Después de 5 verificaciones exitosas, MongoDB se marca como "healthy"

2. **La API espera a MongoDB**:
   - El contenedor `million-api` espera a que MongoDB esté "healthy" (gracias a `depends_on.condition: service_healthy`)
   - Una vez MongoDB está listo, la API inicia automáticamente
   - La API se conecta a MongoDB usando el nombre del servicio: `mongodb://mongodb:27017`

3. **Conexión establecida**:
   - Verás el mensaje: `Now listening on: http://[::]:80`
   - La API está lista para recibir peticiones

**Logs esperados:**

```
million-mongodb  | Listening on 0.0.0.0
million-mongodb  | Waiting for connections
million-api      | Now listening on: http://[::]:80
million-api      | Application started. Press Ctrl+C to shut down.
```

### Paso 2: Importar datos de prueba

En **otra terminal** (sin detener docker-compose), ejecuta:

```bash
# Importar las 25 propiedades de ejemplo
docker exec -i million-mongodb mongoimport \
  --db milliondb \
  --collection properties \
  --jsonArray < seed/properties.json
```

**Salida esperada:**
```
2025-11-17T20:56:39.447+0000    25 document(s) imported successfully. 0 document(s) failed to import.
```

**Verificar la importación:**

```bash
docker exec million-mongodb mongosh milliondb \
  --eval "db.properties.countDocuments()"
```

**Salida esperada:** `25`

### Paso 3: Verificar que la API funciona

Abre tu navegador en cualquiera de estas URLs:

- **Swagger UI (Documentación interactiva)**: http://localhost:5000/swagger
- **Listar todas las propiedades**: http://localhost:5000/api/properties
- **Filtrar por nombre**: http://localhost:5000/api/properties?name=Casa
- **Filtrar por ciudad**: http://localhost:5000/api/properties?address=Bogotá
- **Filtrar por rango de precio**: http://localhost:5000/api/properties?minPrice=200000000&maxPrice=1000000000
- **Paginación**: http://localhost:5000/api/properties?page=2&pageSize=5

**Respuesta esperada (ejemplo):**

```json
{
  "data": [
    {
      "id": "673a5f8e9c1d2e3f4a5b6c7d",
      "idOwner": "owner001",
      "name": "Casa Moderna en Chapinero",
      "address": "Carrera 7 #45-23, Chapinero, Bogotá",
      "price": 850000000,
      "imageUrl": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalCount": 25,
    "totalPages": 3
  }
}
```

### Paso 4: Detener los contenedores

Cuando termines, puedes detener los servicios:

```bash
# Opción 1: Ctrl+C en la terminal donde corre docker-compose

# Opción 2: Detener y eliminar contenedores
docker-compose down

# Opción 3: Detener, eliminar contenedores Y eliminar volúmenes (borra los datos)
docker-compose down -v
```

### Comandos útiles

```bash
# Ver logs de un servicio específico
docker logs million-api
docker logs million-mongodb

# Ver logs en tiempo real
docker logs -f million-api

# Verificar estado de los contenedores
docker ps

# Acceder a la shell de MongoDB
docker exec -it million-mongodb mongosh milliondb

# Ver todas las propiedades en MongoDB
docker exec million-mongodb mongosh milliondb \
  --eval "db.properties.find().pretty()"
```

---

## Solución de problemas comunes

### Error: "Port already in use"

**Causa**: El puerto 5000 o 27017 ya está en uso.

**Solución**:
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :27017

# macOS/Linux
lsof -i :5000
lsof -i :27017

# Detener el proceso o cambiar el puerto en docker-compose.yml
```

### Error: "No properties found" después de importar

**Causa**: Los datos no se importaron correctamente.

**Solución**:
```bash
# Verificar conteo
docker exec million-mongodb mongosh milliondb \
  --eval "db.properties.countDocuments()"

# Si retorna 0, reimportar con --drop
docker exec -i million-mongodb mongoimport \
  --db milliondb \
  --collection properties \
  --jsonArray \
  --drop < seed/properties.json
```

### La API no inicia después de MongoDB

**Causa**: El healthcheck de MongoDB está fallando o tardando mucho.

**Solución**:
```bash
# Ver el estado del healthcheck
docker inspect million-mongodb | grep -A 5 Health

# Reiniciar los servicios
docker-compose down
docker-compose up --build
```

---

## Opción 2: Ejecución Local

### Paso 1: Iniciar MongoDB

**En Windows:**
```bash
# Crear directorio para datos (si no existe)
mkdir d:\data\db

# Iniciar MongoDB
mongod --dbpath d:\data\db
```

**En macOS/Linux:**
```bash
# Crear directorio para datos
sudo mkdir -p /data/db
sudo chown -R $USER /data/db

# Iniciar MongoDB
mongod
```

**Alternativa con MongoDB como servicio:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod
```

### Paso 2: Importar datos de prueba

```bash
# Desde la raíz del proyecto
mongoimport --db milliondb \
  --collection properties \
  --file seed/properties.json \
  --jsonArray

# Verificar importación
mongosh milliondb --eval "db.properties.countDocuments()"
# Debería retornar: 25
```

### Paso 3: Configurar la API

Verifica el archivo de configuración `backend/Million.Api/appsettings.json`:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "milliondb",
    "PropertiesCollectionName": "properties"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Paso 4: Restaurar dependencias

```bash
cd backend
dotnet restore
```

### Paso 5: Ejecutar la API

```bash
cd Million.Api
dotnet run
```
- **Swagger UI**: http://localhost:5137/swagger

---

**Desarrollador**: Cristian Hoyos
**Proyecto**: Million Luxury Technical Test
**Año**: 2025
