# Historias de Usuario - Million Luxury

> **Proyecto**: Sistema de Gestión de Propiedades Inmobiliarias
> **Sprint**: 2 días
> **Metodología**: Cada historia de usuario corresponde a commits atómicos específicos

---

## Formato de Historias

Cada historia sigue el formato estándar:

```
Como [rol]
Quiero [funcionalidad]
Para [beneficio/valor]

Acceptance Criteria:
- [ ] Criterio 1
- [ ] Criterio 2

Definition of Done:
- Código implementado y funcionando
- Tests unitarios escritos y pasando
- Commit realizado con mensaje descriptivo
- Documentación actualizada si aplica
```

---

## Epic 1: Infraestructura y Configuración Base

### US-001: Inicializar Repositorio y Estructura de Proyecto

**Como** desarrollador
**Quiero** tener un repositorio Git configurado con la estructura base de carpetas
**Para** poder empezar a desarrollar de manera organizada

**Acceptance Criteria:**
- ✅ Repositorio Git creado en GitHub
- ✅ Estructura de carpetas `backend/` y `frontend/` creada
- ✅ `.gitignore` configurado para .NET y Node.js
- ✅ README.md inicial con descripción del proyecto
- ✅ Branches `main` y `develop` creados

**Commits asociados:**
```bash
git commit -m "chore: initialize repository with project structure"
```

**Archivos modificados:**
- `.gitignore`
- `README.md`
- `backend/` (directorio)
- `frontend/` (directorio)

---

### US-002: Configurar Docker Compose para Infraestructura Local

**Como** desarrollador
**Quiero** tener un entorno de desarrollo containerizado
**Para** garantizar reproducibilidad en cualquier máquina

**Acceptance Criteria:**
- ✅ `docker-compose.yml` creado con servicio MongoDB
- ✅ MongoDB accesible en puerto 27017
- ✅ Volumen persistente para datos configurado
- ✅ Servicio se levanta correctamente con `docker-compose up`

**Commits asociados:**
```bash
git commit -m "chore(infra): add docker-compose with mongodb service"
```

**Archivos modificados:**
- `docker-compose.yml`

---

## Epic 2: Backend - API .NET

### US-003: Crear Estructura de Proyecto .NET (Clean Architecture)

**Como** desarrollador backend
**Quiero** tener una arquitectura limpia con separación de capas
**Para** mantener el código organizado y escalable

**Acceptance Criteria:**
- ✅ Solución .NET creada con 5 proyectos
- ✅ Referencias entre proyectos correctamente configuradas
- ✅ Cada proyecto compila sin errores

**Commits asociados:**
```bash
git commit -m "chore(backend): create .NET solution with clean architecture layers"
```

**Archivos modificados:**
- `backend/Million.sln`
- `backend/Million.Api/Million.Api.csproj`
- `backend/Million.Core/Million.Core.csproj`
- `backend/Million.Infrastructure/Million.Infrastructure.csproj`
- `backend/Million.Application/Million.Application.csproj`
- `backend/Million.Tests/Million.Tests.csproj`

---

### US-004: Definir Entidad Property y DTOs

**Como** desarrollador backend
**Quiero** tener las entidades de dominio y DTOs definidos
**Para** modelar correctamente los datos de propiedades

**Acceptance Criteria:**
- ✅ Entidad `Property` creada con todos los campos requeridos
- ✅ DTO `PropertyDto` creado para respuestas API
- ✅ DTO `PropertyListResponseDto` con metadata de paginación
- ✅ Atributos de MongoDB correctamente configurados

**Commits asociados:**
```bash
git commit -m "feat(core): add Property entity and DTOs"
```

**Archivos modificados:**
- `backend/Million.Core/Entities/Property.cs`
- `backend/Million.Core/DTOs/PropertyDto.cs`
- `backend/Million.Core/DTOs/PropertyListResponseDto.cs`
- `backend/Million.Core/DTOs/PaginationMetaDto.cs`

---

### US-005: Implementar Repository Pattern con MongoDB

**Como** desarrollador backend
**Quiero** implementar un repository para acceso a datos de MongoDB
**Para** abstraer la lógica de persistencia

**Acceptance Criteria:**
- ✅ Interface `IPropertyRepository` definida en Core
- ✅ Implementación `PropertyRepository` creada
- ✅ `MongoDbContext` configurado correctamente
- ✅ Método `GetListAsync` implementado con filtros
- ✅ Método `GetByIdAsync` implementado
- ✅ Filtros funcionan: name, address, minPrice, maxPrice

**Commits asociados:**
```bash
git commit -m "feat(core): add IPropertyRepository interface"
git commit -m "feat(infrastructure): implement PropertyRepository with MongoDB"
```

**Archivos modificados:**
- `backend/Million.Core/Interfaces/IPropertyRepository.cs`
- `backend/Million.Infrastructure/Data/MongoDbContext.cs`
- `backend/Million.Infrastructure/Repositories/PropertyRepository.cs`

---

### US-006: Crear Controller de Propiedades con Endpoints REST

**Como** cliente de la API
**Quiero** tener endpoints REST para consultar propiedades
**Para** obtener listados y detalles de propiedades

**Acceptance Criteria:**
- ✅ Endpoint `GET /api/properties` implementado
- ✅ Endpoint `GET /api/properties/{id}` implementado
- ✅ Paginación funcional
- ✅ Validación de parámetros
- ✅ Status codes apropiados (200, 404)

**Commits asociados:**
```bash
git commit -m "feat(api): add PropertiesController with list and detail endpoints"
```

**Archivos modificados:**
- `backend/Million.Api/Controllers/PropertiesController.cs`

---

### US-007: Configurar Swagger para Documentación de API

**Como** consumidor de la API
**Quiero** tener documentación interactiva de los endpoints
**Para** entender cómo usar la API sin leer código

**Acceptance Criteria:**
- ✅ Swagger UI accesible en `/swagger`
- ✅ Endpoints documentados con descripciones
- ✅ Modelos de request/response visibles
- ✅ Ejemplos de uso incluidos

**Commits asociados:**
```bash
git commit -m "feat(api): add swagger documentation"
```

**Archivos modificados:**
- `backend/Million.Api/Program.cs`

---

### US-008: Implementar Middleware de Manejo de Errores Global

**Como** desarrollador backend
**Quiero** tener un manejo centralizado de errores
**Para** retornar responses consistentes en caso de excepciones

**Acceptance Criteria:**
- ✅ Middleware `ErrorHandlerMiddleware` creado
- ✅ Errores capturados y logueados
- ✅ Responses JSON con estructura consistente
- ✅ Status codes apropiados

**Commits asociados:**
```bash
git commit -m "feat(api): add global error handler middleware"
```

**Archivos modificados:**
- `backend/Million.Api/Middleware/ErrorHandlerMiddleware.cs`
- `backend/Million.Api/Program.cs`

---

### US-009: Configurar CORS para Frontend

**Como** desarrollador frontend
**Quiero** que la API permita requests desde localhost:3000
**Para** consumir los endpoints sin errores de CORS

**Acceptance Criteria:**
- ✅ Policy CORS configurada en Program.cs
- ✅ Origin `http://localhost:3000` permitido
- ✅ Headers y métodos ANY permitidos
- ✅ Requests desde frontend funcionan

**Commits asociados:**
```bash
git commit -m "feat(api): configure CORS for frontend development"
```

**Archivos modificados:**
- `backend/Million.Api/Program.cs`

---

### US-010: Crear Seed Data para MongoDB

**Como** desarrollador
**Quiero** tener datos de prueba en la base de datos
**Para** probar la API y el frontend con información realista

**Acceptance Criteria:**
- ✅ Archivo `properties.json` creado con 20+ propiedades
- ✅ Datos incluyen: nombre, dirección, precio, imagen
- ✅ Precios variados para probar filtros
- ✅ Script de importación documentado

**Commits asociados:**
```bash
git commit -m "chore(db): add seed data with sample properties"
```

**Archivos modificados:**
- `seed/properties.json`
- `README.md`

---

### US-011: Escribir Tests Unitarios para Repository

**Como** desarrollador backend
**Quiero** tener tests unitarios para el repository
**Para** garantizar que las consultas a MongoDB funcionan correctamente

**Acceptance Criteria:**
- ✅ Tests para `GetListAsync` sin filtros
- ✅ Tests para `GetListAsync` con filtros
- ✅ Tests para paginación
- ✅ Tests para `GetByIdAsync`
- ✅ Todos los tests pasan

**Commits asociados:**
```bash
git commit -m "test(infrastructure): add unit tests for PropertyRepository"
```

**Archivos modificados:**
- `backend/Million.Tests/Unit/Repositories/PropertyRepositoryTests.cs`

---

### US-012: Escribir Tests Unitarios para Controller

**Como** desarrollador backend
**Quiero** tener tests unitarios para el controller
**Para** verificar que los endpoints retornan las responses correctas

**Acceptance Criteria:**
- ✅ Tests para `GetProperties` retorna 200 OK
- ✅ Tests para `GetProperties` con filtros
- ✅ Tests para `GetProperty` válido/inválido
- ✅ Mock de `IPropertyRepository` utilizado
- ✅ Todos los tests pasan

**Commits asociados:**
```bash
git commit -m "test(api): add unit tests for PropertiesController"
```

**Archivos modificados:**
- `backend/Million.Tests/Unit/Controllers/PropertiesControllerTests.cs`

---

### US-013: Dockerizar API .NET

**Como** DevOps
**Quiero** tener la API containerizada
**Para** desplegarla fácilmente en cualquier entorno

**Acceptance Criteria:**
- ✅ `Dockerfile` creado en `backend/`
- ✅ Imagen se construye correctamente
- ✅ Contenedor se levanta y expone puerto 80
- ✅ API accesible desde host
- ✅ Servicio agregado a `docker-compose.yml`

**Commits asociados:**
```bash
git commit -m "chore(backend): dockerize .NET API"
```

**Archivos modificados:**
- `backend/Dockerfile`
- `docker-compose.yml`

---

## Epic 3: Frontend - React

### US-014: Inicializar Proyecto React con Vite

**Como** desarrollador frontend
**Quiero** tener un proyecto React configurado
**Para** empezar a desarrollar la UI

**Acceptance Criteria:**
- ✅ Proyecto creado con `npm create vite`
- ✅ Dependencias instaladas
- ✅ Proyecto se levanta correctamente
- ✅ Estructura de carpetas organizada

**Commits asociados:**
```bash
git commit -m "chore(frontend): initialize React project with Vite"
```

**Archivos modificados:**
- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/.env.example`
- `frontend/src/` (estructura)

---

### US-015: Crear API Client con Axios

**Como** desarrollador frontend
**Quiero** tener un cliente HTTP configurado
**Para** consumir los endpoints del backend

**Acceptance Criteria:**
- ✅ Instancia de Axios configurada con baseURL
- ✅ Timeout configurado
- ✅ Interceptor de errores implementado
- ✅ Funciones `getProperties` y `getPropertyById` creadas

**Commits asociados:**
```bash
git commit -m "feat(frontend): add API client with axios"
```

**Archivos modificados:**
- `frontend/src/api/client.js`
- `frontend/src/api/propertiesApi.js`

---

### US-016: Implementar Custom Hook useDebounce

**Como** desarrollador frontend
**Quiero** tener un hook de debouncing
**Para** evitar requests excesivos al escribir en los filtros

**Acceptance Criteria:**
- ✅ Hook `useDebounce` creado
- ✅ Delay configurable (default 500ms)
- ✅ Cleanup de timeout en unmount
- ✅ Hook probado y funcionando

**Commits asociados:**
```bash
git commit -m "feat(frontend): add useDebounce custom hook"
```

**Archivos modificados:**
- `frontend/src/hooks/useDebounce.js`

---

### US-017: Crear Componente PropertyCard

**Como** usuario
**Quiero** ver las propiedades en tarjetas visualmente atractivas
**Para** identificar rápidamente la información relevante

**Acceptance Criteria:**
- ✅ Componente muestra: imagen, nombre, precio, dirección
- ✅ Precio formateado como moneda
- ✅ Click en tarjeta navega a detalle
- ✅ Diseño responsive
- ✅ Imagen con lazy loading

**Commits asociados:**
```bash
git commit -m "feat(frontend): add PropertyCard component"
```

**Archivos modificados:**
- `frontend/src/components/PropertyCard/PropertyCard.jsx`
- `frontend/src/components/PropertyCard/PropertyCard.module.css`
- `frontend/src/utils/formatCurrency.js`

---

### US-018: Crear Componente PropertyFilters

**Como** usuario
**Quiero** tener filtros para buscar propiedades
**Para** encontrar rápidamente lo que necesito

**Acceptance Criteria:**
- ✅ Inputs para: name, address, minPrice, maxPrice
- ✅ Debounce aplicado a inputs de texto
- ✅ Evento `onFilterChange` disparado
- ✅ Botón "Limpiar filtros" funcional
- ✅ Validación básica
- ✅ Diseño responsive

**Commits asociados:**
```bash
git commit -m "feat(frontend): add PropertyFilters component"
```

**Archivos modificados:**
- `frontend/src/pages/PropertiesList/PropertyFilters.jsx`
- `frontend/src/pages/PropertiesList/PropertyFilters.module.css`

---

### US-019: Crear Componente Pagination

**Como** usuario
**Quiero** tener controles de paginación
**Para** navegar entre páginas de resultados

**Acceptance Criteria:**
- ✅ Botones: Primera, Anterior, Siguiente, Última
- ✅ Indicador de página actual
- ✅ Total de páginas visible
- ✅ Botones deshabilitados cuando no aplican
- ✅ Evento `onPageChange` funcional
- ✅ Diseño accesible (ARIA labels)


**Archivos modificados:**
- `frontend/src/components/Pagination/Pagination.jsx`
- `frontend/src/components/Pagination/Pagination.module.css`

---

### US-020: Crear Página PropertiesList

**Como** usuario
**Quiero** ver un listado de propiedades
**Para** explorar las opciones disponibles

**Acceptance Criteria:**
- ✅ Lista de propiedades se carga al montar
- ✅ Filtros funcionales actualizan la lista
- ✅ Paginación funcional
- ✅ Loading state
- ✅ Error state
- ✅ Empty state
- ✅ Grid responsive

**Commits asociados:**
```bash
git commit -m "feat(frontend): add PropertiesList page with filters and pagination"
```

**Archivos modificados:**
- `frontend/src/pages/PropertiesList/PropertiesList.jsx`
- `frontend/src/pages/PropertiesList/PropertiesList.module.css`

---

### US-021: Crear Página PropertyDetail

**Como** usuario
**Quiero** ver los detalles completos de una propiedad
**Para** tomar una decisión informada

**Acceptance Criteria:**
- ✅ Página recibe ID de propiedad desde URL
- ✅ Datos se cargan al montar componente
- ✅ Muestra: imagen, nombre, dirección, precio, owner
- ✅ Botón "Volver" navega a lista
- ✅ Loading state
- ✅ Error 404 si no existe
- ✅ Diseño responsive

**Commits asociados:**
```bash
git commit -m "feat(frontend): add PropertyDetail page"
```

**Archivos modificados:**
- `frontend/src/pages/PropertyDetail/PropertyDetail.jsx`
- `frontend/src/pages/PropertyDetail/PropertyDetail.module.css`

---

### US-022: Configurar Rutas con React Router

**Como** usuario
**Quiero** navegar entre páginas
**Para** acceder a diferentes secciones de la aplicación

**Acceptance Criteria:**
- ✅ Ruta `/` muestra PropertiesList
- ✅ Ruta `/properties/:id` muestra PropertyDetail
- ✅ Ruta `*` muestra página 404
- ✅ Navegación funcional entre rutas

**Commits asociados:**
```bash
git commit -m "feat(frontend): configure routes with React Router"
```

**Archivos modificados:**
- `frontend/src/router.jsx`
- `frontend/src/App.jsx`
- `frontend/src/pages/NotFound/NotFound.jsx`

---

### US-023: Implementar Estilos Responsive

**Como** usuario en dispositivo móvil
**Quiero** que la aplicación se vea bien en mi pantalla
**Para** tener una buena experiencia de usuario

**Acceptance Criteria:**
- ✅ Mobile-first approach implementado
- ✅ Breakpoints: 640px, 768px, 1024px, 1280px
- ✅ Grid responsive (1, 2, 3 columnas)
- ✅ Filtros apilados en mobile
- ✅ Imágenes responsive
- ✅ Touch-friendly buttons
- ✅ Probado en mobile, tablet, desktop

**Commits asociados:**
```bash
git commit -m "style(frontend): implement responsive design across all components"
```

**Archivos modificados:**
- `frontend/src/styles/variables.css`
- Todos los archivos `.module.css`

---

### US-024: Escribir Tests Unitarios Frontend

**Como** desarrollador frontend
**Quiero** tener tests unitarios para componentes
**Para** garantizar que la UI funciona correctamente

**Acceptance Criteria:**
- ✅ Test: PropertyCard se renderiza
- ✅ Test: PropertyFilters dispara onChange
- ✅ Test: Pagination cambia de página
- ✅ Test: PropertiesList muestra loading/error
- ✅ Test: PropertyDetail muestra 404
- ✅ Todos los tests pasan

**Commits asociados:**
```bash
git commit -m "test(frontend): add unit tests for components"
```

**Archivos modificados:**
- `frontend/src/components/PropertyCard/PropertyCard.test.jsx`
- `frontend/src/pages/PropertiesList/PropertyFilters.test.jsx`
- `frontend/src/components/Pagination/Pagination.test.jsx`
- `frontend/src/pages/PropertiesList/PropertiesList.test.jsx`
- `frontend/src/pages/PropertyDetail/PropertyDetail.test.jsx`

---

### US-025: Dockerizar Frontend

**Como** DevOps
**Quiero** tener el frontend containerizado
**Para** desplegar toda la aplicación con Docker

**Acceptance Criteria:**
- ✅ `Dockerfile` creado en `frontend/`
- ✅ Imagen se construye correctamente
- ✅ Contenedor expone puerto 3000
- ✅ Frontend accesible desde host
- ✅ Servicio agregado a `docker-compose.yml`
- ✅ Variable `VITE_API_BASE_URL` configurada

**Commits asociados:**
```bash
git commit -m "chore(frontend): dockerize React app"
```

**Archivos modificados:**
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `docker-compose.yml`

---

## Epic 4: Integración y Deployment

### US-026: Integrar Stack Completo con Docker Compose

**Como** desarrollador
**Quiero** levantar toda la aplicación con un solo comando
**Para** facilitar el desarrollo y las pruebas

**Acceptance Criteria:**
- ✅ `docker-compose up` levanta MongoDB, API y Frontend
- ✅ Servicios se comunican correctamente
- ✅ Healthchecks configurados
- ✅ Logs accesibles
- ✅ Aplicación funcional end-to-end

**Commits asociados:**
```bash
git commit -m "chore(infra): integrate full stack with docker-compose"
```

**Archivos modificados:**
- `docker-compose.yml`

---

### US-027: Crear Documentación Completa en README

**Como** nuevo desarrollador en el proyecto
**Quiero** tener documentación clara
**Para** poder ejecutar y entender el proyecto rápidamente

**Acceptance Criteria:**
- ✅ Descripción del proyecto
- ✅ Requisitos previos
- ✅ Instrucciones de instalación
- ✅ Cómo ejecutar tests
- ✅ Endpoints API documentados
- ✅ Variables de entorno explicadas
- ✅ Estructura de carpetas
- ✅ Troubleshooting

**Commits asociados:**
```bash
git commit -m "docs: add comprehensive README with setup instructions"
```

**Archivos modificados:**
- `README.md`

---

### US-028: Generar Backup de MongoDB

**Como** evaluador de la prueba
**Quiero** tener un backup de la base de datos
**Para** restaurar los datos de prueba fácilmente

**Acceptance Criteria:**
- ✅ Comando `mongodump` ejecutado
- ✅ Carpeta `dump/` con backup generado
- ✅ Instrucciones de restore documentadas
- ✅ Backup incluido en repositorio

**Commits asociados:**
```bash
git commit -m "chore(db): add MongoDB backup"
```

**Archivos modificados:**
- `dump/` (carpeta con backup)
- `README.md`

---

### US-029: Configurar CI con GitHub Actions (Opcional)

**Como** desarrollador
**Quiero** tener integración continua
**Para** detectar errores automáticamente

**Acceptance Criteria:**
- ✅ Workflow `.github/workflows/ci.yml` creado
- ✅ Job: Build backend
- ✅ Job: Build frontend
- ✅ Job: Build Docker images
- ✅ Workflow se ejecuta en push y PR
- ✅ Badge de status en README

**Commits asociados:**
```bash
git commit -m "ci: add GitHub Actions workflow"
```

**Archivos modificados:**
- `.github/workflows/ci.yml`
- `README.md`

---

### US-030: Preparar Entrega Final

**Como** candidato
**Quiero** preparar todos los entregables
**Para** enviar la prueba completa

**Acceptance Criteria:**
- ✅ Código en GitHub con acceso otorgado
- ✅ README completo y actualizado
- ✅ Backup de MongoDB incluido
- ✅ Tests pasando
- ✅ Docker compose funcional
- ✅ Commits limpios
- ✅ Sin archivos sensibles

**Commits asociados:**
```bash
git commit -m "chore: prepare final delivery"
```

**Archivos modificados:**
- Revisión general de todos los archivos
- `package.json` (version)

---

## Resumen de Commits por Día

### Día 1 - Backend (15 commits)
```
1.  chore: initialize repository with project structure
2.  chore(infra): add docker-compose with mongodb service
3.  chore(backend): create .NET solution with clean architecture layers
4.  feat(core): add Property entity and DTOs
5.  feat(core): add IPropertyRepository interface
6.  feat(infrastructure): implement PropertyRepository with MongoDB
7.  feat(api): add PropertiesController with list and detail endpoints
8.  feat(api): add swagger documentation
9.  feat(api): add global error handler middleware
10. feat(api): configure CORS for frontend development
11. chore(db): add seed data with sample properties
12. test(infrastructure): add unit tests for PropertyRepository
13. test(api): add unit tests for PropertiesController
14. chore(backend): dockerize .NET API
15. chore(infra): integrate backend services with docker-compose
```

### Día 2 - Frontend + Integración (15 commits)
```
16. chore(frontend): initialize React project with Vite
17. feat(frontend): add API client with axios
18. feat(frontend): add useDebounce custom hook
19. feat(frontend): add PropertyCard component
20. feat(frontend): add PropertyFilters component
21. feat(frontend): add Pagination component
22. feat(frontend): add PropertiesList page with filters and pagination
23. feat(frontend): add PropertyDetail page
24. feat(frontend): configure routes with React Router
25. style(frontend): implement responsive design across all components
26. test(frontend): add unit tests for components
27. chore(frontend): dockerize React app
28. chore(infra): integrate full stack with docker-compose
29. docs: add comprehensive README with setup instructions
30. chore(db): add MongoDB backup
```

---

## Convenciones de Commits (Conventional Commits)

**Formato:**
```
<type>(<scope>): <subject>

[optional body]
```

**Types:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato (no cambia lógica)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento
- `ci`: CI/CD

**Scopes:**
- `api`: Backend API
- `core`: Capa de dominio
- `infrastructure`: Capa de infraestructura
- `frontend`: React app
- `infra`: Docker, CI/CD
- `db`: Base de datos

**Ejemplos:**
```bash
git commit -m "feat(api): add endpoint to filter properties by owner"
git commit -m "fix(frontend): correct price formatting for large numbers"
git commit -m "test(infrastructure): add test for price range filter"
git commit -m "docs: update API examples in README"
```

---

**Autor**: Cristian Hoyos
**Proyecto**: Million Luxury Technical Test
**Fecha**: 2025
