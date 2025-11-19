# Million Luxury - Property Management System

Sistema full-stack para gestión y visualización de propiedades inmobiliarias.

## 🏗️ Stack Tecnológico

### Backend
- **.NET 8** - Framework para API REST
- **C#** - Lenguaje de programación
- **MongoDB** - Base de datos NoSQL
- **NUnit** - Testing framework

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool
- **React Router** - Navegación
- **Axios** - HTTP client
- **Vitest** - Testing framework

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de servicios

## 📋 Requisitos Previos

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [MongoDB](https://www.mongodb.com/try/download/community) (opcional si usas Docker)

## 🚀 Inicio Rápido

### Opción 1: Docker Compose (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/CristianHoyosVelandia/million-technical-test.git
cd million-technical-test

# Levantar todos los servicios
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost:3000
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

### Opción 2: Ejecución Local

#### Backend

```bash
cd backend/Million.Api
dotnet restore
dotnet run
```

La API estará disponible en `http://localhost:5000`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

#### MongoDB

```bash
# Iniciar MongoDB
mongod --dbpath ./data/db

# Importar datos de prueba (25 propiedades de ejemplo)
mongoimport --db milliondb --collection properties --file seed/properties.json --jsonArray

# Verificar importación
mongosh milliondb --eval "db.properties.countDocuments()"
```

**Datos de prueba incluidos:**
- 25 propiedades en diferentes ubicaciones de Bogotá y alrededores
- Precios variados: desde $180.000.000 hasta $2.500.000.000
- Diferentes tipos: casas, apartamentos, penthouses, lofts
- Todos los campos requeridos: nombre, dirección, precio, imágenes, año

## 🧪 Tests

### Backend

```bash
cd backend
dotnet test
```

### Frontend

```bash
cd frontend
npm test
```

**Tests implementados:**
- ✅ 16 tests de WebServices (API integration)
- ✅ Tests de filtros (name, address, price range)
- ✅ Tests de paginación
- ✅ Tests de manejo de errores (404, 500, network)
- ✅ Tests de configuración del cliente API

**Ver documentación completa**: [frontend/TESTING.md](frontend/TESTING.md)

## 📁 Estructura del Proyecto

```
million-technical-test/
├── backend/              # API .NET
│   ├── Million.Api/      # Capa de presentación
│   ├── Million.Core/     # Entidades y DTOs
│   ├── Million.Infrastructure/  # Acceso a datos
│   ├── Million.Application/     # Lógica de negocio
│   └── Million.Tests/    # Tests unitarios
├── frontend/             # Aplicación React
│   ├── src/
│   │   ├── api/         # Cliente HTTP
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas/vistas
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # Utilidades
│   └── public/
├── seed/                # Datos iniciales
├── docs/                # Documentación técnica
└── docker-compose.yml   # Configuración Docker
```

## 📚 Documentación

- [Plan Técnico](docs/technical-plan.md)
- [Historias de Usuario](docs/user-stories.md)

## 🔧 Configuración

### Variables de Entorno

#### Backend (`backend/Million.Api/appsettings.json`)
```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "milliondb"
  }
}
```

#### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🎯 Funcionalidades Principales

- ✅ Listado de propiedades con paginación
- ✅ Filtros por nombre, dirección y rango de precio
- ✅ Vista detallada de propiedades
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ API RESTful documentada con Swagger
- ✅ Tests unitarios en backend y frontend

## 📧 Contacto

**Desarrollador**: Cristian Hoyos
**Proyecto**: Million Luxury Technical Test
**Año**: 2025

---

Desarrollado como prueba técnica para **Million Luxury**
