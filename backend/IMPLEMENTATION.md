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

## Opción 1: Ejecución con Docker (Recomendado)

Esta opción levanta automáticamente MongoDB y la API en contenedores.

### Paso 1: Levantar servicios

```bash
# Desde la raíz del proyecto
docker-compose up mongodb api
```

### Paso 2: Importar datos de prueba (opcional)

Espera a que MongoDB esté listo (verás el mensaje `MongoDB init process complete`), luego en otra terminal:

```bash
# Importar las 25 propiedades de ejemplo
docker exec -i million-mongodb mongoimport \
  --db milliondb \
  --collection properties \
  --jsonArray < seed/properties.json

# Verificar importación
docker exec million-mongodb mongosh milliondb \
  --eval "db.properties.countDocuments()"
```

### Paso 3: Acceder a la API

- **API Base URL**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/health

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
