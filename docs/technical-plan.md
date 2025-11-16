# Plan Técnico - Prueba Full-Stack Million Luxury

> **Proyecto**: Sistema de Gestión de Propiedades Inmobiliarias
> **Stack**: .NET 8/9 + MongoDB + React/Next.js
> **Duración**: 2 días (Sprint intensivo)
> **Metodología**: Scrum-lite con entregas incrementales

---

## 1. Objetivo General de la Prueba

Construir una **aplicación full-stack** escalable y mantenible que permita:

- **Backend**: API RESTful en C# (.NET 8/9) que expone endpoints para listar y filtrar propiedades almacenadas en MongoDB
- **Frontend**: SPA en React (o Next.js) que consume la API y presenta la información con filtros interactivos
- **Calidad**: Implementar tests unitarios (NUnit para backend, Jest/React Testing Library para frontend)
- **Infraestructura**: Containerización con Docker para reproducibilidad
- **Entregables**: Código fuente (GitHub), backup de MongoDB, documentación de ejecución

### Requisitos Funcionales Detallados

#### Backend API (.NET 8/9 + C#)

1. **Endpoints principales**:
   - `GET /api/properties` - Listar propiedades con filtros y paginación
   - `GET /api/properties/{id}` - Obtener detalle de una propiedad

2. **Filtros implementados**:
   - `name` (string): Búsqueda parcial por nombre de propiedad
   - `address` (string): Búsqueda parcial por dirección
   - `minPrice` (decimal?): Precio mínimo
   - `maxPrice` (decimal?): Precio máximo
   - `page` (int): Número de página (default: 1)
   - `pageSize` (int): Elementos por página (default: 10, max: 50)

3. **DTO de respuesta** (`PropertyDto`):
   ```csharp
   {
     "id": "string",
     "idOwner": "string",
     "name": "string",
     "address": "string",
     "price": decimal,
     "imageUrl": "string"  // URL de una única imagen
   }
   ```

4. **Respuesta paginada**:
   ```json
   {
     "data": [PropertyDto],
     "meta": {
       "page": 1,
       "pageSize": 10,
       "totalCount": 42,
       "totalPages": 5
     }
   }
   ```

#### Frontend (React + Vite)

1. **Páginas**:
   - **Lista de propiedades**: Grid/lista con tarjetas de propiedad
   - **Detalle de propiedad**: Vista ampliada con toda la información

2. **Componentes**:
   - `PropertyCard`: Tarjeta individual con imagen, nombre, precio, dirección
   - `PropertyFilters`: Formulario con inputs para filtros
   - `Pagination`: Controles de paginación
   - `PropertyDetail`: Vista completa de la propiedad

3. **Features**:
   - Filtros con debounce (500ms) para evitar requests excesivos
   - Loading states y manejo de errores
   - Responsive design (mobile-first)
   - Lazy loading de imágenes

#### Base de Datos (MongoDB)

**Colección**: `properties`

**Modelo de documento**:
```json
{
  "_id": "ObjectId",
  "idOwner": "string",
  "name": "string",
  "address": "string",
  "price": NumberDecimal,
  "imageUrl": "string",
  "codeInternal": "string",
  "year": int,
  "enabled": boolean,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**Índices necesarios**:
- `{ name: "text", address: "text" }` - Búsqueda de texto
- `{ price: 1 }` - Filtro por rango de precio
- `{ idOwner: 1 }` - Consultas por propietario

---

## 2. Metodología Ágil (Sprint de 2 días)

### Framework: Scrum adaptado para entrega rápida

#### Ceremonias

| Ceremonia | Duración | Momento | Objetivo |
|-----------|----------|---------|----------|
| **Sprint Planning** | 30 min | Día 1 - inicio | Revisar alcance, crear backlog, asignar tareas |
| **Daily Standup** | 10 min | Día 1 y 2 - mañana | Sincronizar progreso, identificar bloqueos |
| **Sprint Review** | 30 min | Día 2 - final | Demo funcional de la aplicación |
| **Retrospectiva** | 15 min | Día 2 - final | Lecciones aprendidas y mejoras |

#### Definition of Done (DoD)

Una historia se considera **completada** cuando:

- ✅ Código implementado y funcionando localmente
- ✅ Commit atómico en Git con mensaje descriptivo
- ✅ Tests unitarios escritos y pasando (cobertura mínima en casos críticos)
- ✅ Sin errores de lint/warnings críticos
- ✅ Documentación actualizada (README, comentarios en código complejo)
- ✅ Revisión de código propia (self-review)

#### Backlog Priorizado

**Sprint Backlog** (ordenado por prioridad):

1. **Día 1 - Backend + Infraestructura**
   - Configurar infraestructura Docker (Mongo + API)
   - Crear estructura de proyecto .NET (Clean Architecture)
   - Implementar entidades y DTOs
   - Implementar repository con MongoDB.Driver
   - Crear endpoints de API con filtros
   - Agregar Swagger para documentación
   - Implementar middleware de manejo de errores
   - Crear seed data (20+ propiedades)
   - Escribir tests NUnit para repository y controller

2. **Día 2 - Frontend + Integración**
   - Configurar proyecto React con Vite
   - Crear estructura de carpetas (pages, components, services)
   - Implementar API client con Axios
   - Crear página de lista con filtros
   - Crear página de detalle
   - Implementar paginación
   - Agregar responsive design
   - Escribir tests unitarios con Vitest
   - Dockerizar frontend
   - Crear docker-compose orquestando todos los servicios
   - Escribir README con instrucciones completas
   - Generar backup de MongoDB

---

## 3. Arquitectura Técnica

### 3.1 Arquitectura Backend (Clean Architecture Simplificada)

```
backend/
├── Million.Api/                    # Capa de presentación (Web API)
│   ├── Controllers/
│   │   └── PropertiesController.cs
│   ├── Middleware/
│   │   └── ErrorHandlerMiddleware.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── appsettings.Development.json
│
├── Million.Core/                   # Capa de dominio (Entities, DTOs, Interfaces)
│   ├── Entities/
│   │   ├── Property.cs
│   │   └── Owner.cs
│   ├── DTOs/
│   │   ├── PropertyDto.cs
│   │   ├── PropertyListResponseDto.cs
│   │   └── PaginationMetaDto.cs
│   ├── Interfaces/
│   │   └── IPropertyRepository.cs
│   └── Exceptions/
│       └── NotFoundException.cs
│
├── Million.Infrastructure/         # Capa de infraestructura (acceso a datos)
│   ├── Data/
│   │   └── MongoDbContext.cs
│   ├── Repositories/
│   │   └── PropertyRepository.cs
│   └── Extensions/
│       └── ServiceCollectionExtensions.cs
│
├── Million.Application/            # Capa de aplicación (casos de uso)
│   ├── Services/
│   │   ├── PropertyService.cs
│   │   └── IPropertyService.cs
│   └── Mappings/
│       └── PropertyMappingProfile.cs  # AutoMapper (opcional)
│
└── Million.Tests/                  # Tests unitarios
    ├── Unit/
    │   ├── Repositories/
    │   │   └── PropertyRepositoryTests.cs
    │   └── Controllers/
    │       └── PropertiesControllerTests.cs
    └── Integration/
        └── PropertiesEndpointTests.cs
```

#### Flujo de datos (request-response)

```
Client Request
    ↓
PropertiesController (API Layer)
    ↓
PropertyService (Application Layer)
    ↓
PropertyRepository (Infrastructure Layer)
    ↓
MongoDbContext → MongoDB
    ↓
Entity (Property)
    ↓
DTO Mapping (PropertyDto)
    ↓
JSON Response → Client
```

#### Dependencias Backend

```xml
<!-- Million.Api -->
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />

<!-- Million.Infrastructure -->
<PackageReference Include="MongoDB.Driver" Version="2.23.0" />

<!-- Million.Application -->
<PackageReference Include="AutoMapper" Version="12.0.1" /> <!-- Opcional -->
<PackageReference Include="FluentValidation" Version="11.9.0" />

<!-- Million.Tests -->
<PackageReference Include="NUnit" Version="3.14.0" />
<PackageReference Include="NUnit3TestAdapter" Version="4.5.0" />
<PackageReference Include="Moq" Version="4.20.0" />
<PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
```

### 3.2 Arquitectura Frontend (React + Vite)

```
frontend/
├── public/
│   └── images/                    # Imágenes estáticas (placeholders)
│
├── src/
│   ├── api/                       # Capa de comunicación con backend
│   │   ├── client.js              # Axios instance configurada
│   │   └── propertiesApi.js       # Endpoints de propiedades
│   │
│   ├── components/                # Componentes reutilizables
│   │   ├── PropertyCard/
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyCard.module.css
│   │   │   └── PropertyCard.test.jsx
│   │   ├── Pagination/
│   │   │   ├── Pagination.jsx
│   │   │   └── Pagination.module.css
│   │   ├── Spinner/
│   │   │   └── Spinner.jsx
│   │   └── ErrorMessage/
│   │       └── ErrorMessage.jsx
│   │
│   ├── pages/                     # Páginas principales (rutas)
│   │   ├── PropertiesList/
│   │   │   ├── PropertiesList.jsx
│   │   │   ├── PropertiesFilters.jsx
│   │   │   ├── PropertiesList.module.css
│   │   │   └── PropertiesList.test.jsx
│   │   └── PropertyDetail/
│   │       ├── PropertyDetail.jsx
│   │       ├── PropertyDetail.module.css
│   │       └── PropertyDetail.test.jsx
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useDebounce.js
│   │   ├── usePagination.js
│   │   └── useProperties.js       # Hook para manejar lógica de propiedades
│   │
│   ├── utils/                     # Utilidades
│   │   ├── formatCurrency.js
│   │   └── constants.js
│   │
│   ├── styles/                    # Estilos globales
│   │   ├── variables.css
│   │   └── global.css
│   │
│   ├── App.jsx                    # Componente raíz
│   ├── main.jsx                   # Entry point
│   └── router.jsx                 # Configuración de rutas (React Router)
│
├── .env.example
├── .env.development
├── vite.config.js
├── package.json
└── vitest.config.js
```

#### Dependencias Frontend

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "vitest": "^1.0.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2"
  }
}
```

### 3.3 Infraestructura Docker

#### docker-compose.yml (orquestación de servicios)

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: million-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: milliondb
    volumes:
      - mongo-data:/data/db
      - ./seed:/docker-entrypoint-initdb.d  # Auto-import seed data
    networks:
      - million-network

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: million-api
    restart: unless-stopped
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - MongoDbSettings__ConnectionString=mongodb://mongodb:27017
      - MongoDbSettings__DatabaseName=milliondb
    depends_on:
      - mongodb
    networks:
      - million-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: million-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:5000/api
    depends_on:
      - api
    networks:
      - million-network

volumes:
  mongo-data:

networks:
  million-network:
    driver: bridge
```

---

## 4. Plan de Desarrollo Detallado (Día a Día)

### **Día 0 - Preparación (Pre-Sprint)**

**Duración**: 1 hora

#### Tareas:
1. ✅ Crear repositorio GitHub: `million-technical-test`
2. ✅ Configurar `.gitignore` para .NET y Node
3. ✅ Crear estructura de ramas:
   - `main` (producción)
   - `develop` (desarrollo)
   - `feature/*` (features individuales)
4. ✅ Crear README inicial con descripción del proyecto
5. ✅ Configurar GitHub Actions para CI (opcional pero recomendado)

---

### **Día 1 - Backend + Base de Datos**

#### **Mañana (8:00 - 13:00)**

**Sprint Planning** (8:00 - 8:30)
- Revisar historias de usuario
- Definir prioridades
- Estimar esfuerzo

**Desarrollo** (8:30 - 13:00)

##### 1. Configurar Infraestructura Docker (1 hora)
- Crear `docker-compose.yml` con servicio MongoDB
- Crear carpeta `seed/` con datos iniciales
- Verificar conexión a MongoDB con Mongo Compass

##### 2. Crear Proyecto .NET (30 min)
```bash
mkdir backend && cd backend
dotnet new sln -n Million
dotnet new webapi -n Million.Api
dotnet new classlib -n Million.Core
dotnet new classlib -n Million.Infrastructure
dotnet new classlib -n Million.Application
dotnet new nunit -n Million.Tests

dotnet sln add Million.Api/Million.Api.csproj
dotnet sln add Million.Core/Million.Core.csproj
dotnet sln add Million.Infrastructure/Million.Infrastructure.csproj
dotnet sln add Million.Application/Million.Application.csproj
dotnet sln add Million.Tests/Million.Tests.csproj
```

##### 3. Implementar Capa de Dominio (1 hora)
- **Million.Core/Entities/Property.cs**
  ```csharp
  using MongoDB.Bson;
  using MongoDB.Bson.Serialization.Attributes;

  public class Property
  {
      [BsonId]
      [BsonRepresentation(BsonType.ObjectId)]
      public string Id { get; set; }

      public string IdOwner { get; set; }
      public string Name { get; set; }
      public string Address { get; set; }
      public decimal Price { get; set; }
      public string ImageUrl { get; set; }
      public string CodeInternal { get; set; }
      public int Year { get; set; }
      public bool Enabled { get; set; } = true;
      public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
      public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
  }
  ```

- **Million.Core/DTOs/PropertyDto.cs**
  ```csharp
  public class PropertyDto
  {
      public string Id { get; set; }
      public string IdOwner { get; set; }
      public string Name { get; set; }
      public string Address { get; set; }
      public decimal Price { get; set; }
      public string ImageUrl { get; set; }
  }
  ```

- **Million.Core/DTOs/PropertyListResponseDto.cs**
  ```csharp
  public class PropertyListResponseDto
  {
      public List<PropertyDto> Data { get; set; }
      public PaginationMetaDto Meta { get; set; }
  }

  public class PaginationMetaDto
  {
      public int Page { get; set; }
      public int PageSize { get; set; }
      public long TotalCount { get; set; }
      public int TotalPages { get; set; }
  }
  ```

- **Million.Core/Interfaces/IPropertyRepository.cs**
  ```csharp
  public interface IPropertyRepository
  {
      Task<(IEnumerable<Property> properties, long totalCount)> GetListAsync(
          string name,
          string address,
          decimal? minPrice,
          decimal? maxPrice,
          int page,
          int pageSize
      );

      Task<Property> GetByIdAsync(string id);
  }
  ```

##### 4. Implementar Capa de Infraestructura (1.5 horas)

- **Million.Infrastructure/Data/MongoDbContext.cs**
  ```csharp
  using MongoDB.Driver;
  using Microsoft.Extensions.Options;

  public class MongoDbContext
  {
      private readonly IMongoDatabase _database;

      public MongoDbContext(IOptions<MongoDbSettings> settings)
      {
          var client = new MongoClient(settings.Value.ConnectionString);
          _database = client.GetDatabase(settings.Value.DatabaseName);
      }

      public IMongoCollection<Property> Properties =>
          _database.GetCollection<Property>("properties");
  }

  public class MongoDbSettings
  {
      public string ConnectionString { get; set; }
      public string DatabaseName { get; set; }
  }
  ```

- **Million.Infrastructure/Repositories/PropertyRepository.cs**
  ```csharp
  using MongoDB.Driver;
  using MongoDB.Driver.Linq;

  public class PropertyRepository : IPropertyRepository
  {
      private readonly MongoDbContext _context;

      public PropertyRepository(MongoDbContext context)
      {
          _context = context;
      }

      public async Task<(IEnumerable<Property> properties, long totalCount)> GetListAsync(
          string name,
          string address,
          decimal? minPrice,
          decimal? maxPrice,
          int page,
          int pageSize)
      {
          var filterBuilder = Builders<Property>.Filter;
          var filters = new List<FilterDefinition<Property>>
          {
              filterBuilder.Eq(p => p.Enabled, true)
          };

          if (!string.IsNullOrWhiteSpace(name))
              filters.Add(filterBuilder.Regex(p => p.Name, new BsonRegularExpression(name, "i")));

          if (!string.IsNullOrWhiteSpace(address))
              filters.Add(filterBuilder.Regex(p => p.Address, new BsonRegularExpression(address, "i")));

          if (minPrice.HasValue)
              filters.Add(filterBuilder.Gte(p => p.Price, minPrice.Value));

          if (maxPrice.HasValue)
              filters.Add(filterBuilder.Lte(p => p.Price, maxPrice.Value));

          var combinedFilter = filterBuilder.And(filters);

          var totalCount = await _context.Properties.CountDocumentsAsync(combinedFilter);

          var properties = await _context.Properties
              .Find(combinedFilter)
              .Skip((page - 1) * pageSize)
              .Limit(pageSize)
              .ToListAsync();

          return (properties, totalCount);
      }

      public async Task<Property> GetByIdAsync(string id)
      {
          return await _context.Properties
              .Find(p => p.Id == id && p.Enabled)
              .FirstOrDefaultAsync();
      }
  }
  ```

#### **Tarde (14:00 - 18:00)**

##### 5. Implementar Capa de API (2 horas)

- **Million.Api/Controllers/PropertiesController.cs**
  ```csharp
  [ApiController]
  [Route("api/[controller]")]
  public class PropertiesController : ControllerBase
  {
      private readonly IPropertyRepository _repository;

      public PropertiesController(IPropertyRepository repository)
      {
          _repository = repository;
      }

      [HttpGet]
      public async Task<ActionResult<PropertyListResponseDto>> GetProperties(
          [FromQuery] string name,
          [FromQuery] string address,
          [FromQuery] decimal? minPrice,
          [FromQuery] decimal? maxPrice,
          [FromQuery] int page = 1,
          [FromQuery] int pageSize = 10)
      {
          pageSize = Math.Min(pageSize, 50); // Limitar a 50 items max

          var (properties, totalCount) = await _repository.GetListAsync(
              name, address, minPrice, maxPrice, page, pageSize
          );

          var propertyDtos = properties.Select(p => new PropertyDto
          {
              Id = p.Id,
              IdOwner = p.IdOwner,
              Name = p.Name,
              Address = p.Address,
              Price = p.Price,
              ImageUrl = p.ImageUrl
          }).ToList();

          var response = new PropertyListResponseDto
          {
              Data = propertyDtos,
              Meta = new PaginationMetaDto
              {
                  Page = page,
                  PageSize = pageSize,
                  TotalCount = totalCount,
                  TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
              }
          };

          return Ok(response);
      }

      [HttpGet("{id}")]
      public async Task<ActionResult<PropertyDto>> GetProperty(string id)
      {
          var property = await _repository.GetByIdAsync(id);

          if (property == null)
              return NotFound(new { message = $"Property with id {id} not found" });

          var dto = new PropertyDto
          {
              Id = property.Id,
              IdOwner = property.IdOwner,
              Name = property.Name,
              Address = property.Address,
              Price = property.Price,
              ImageUrl = property.ImageUrl
          };

          return Ok(dto);
      }
  }
  ```

- **Million.Api/Middleware/ErrorHandlerMiddleware.cs**
  ```csharp
  public class ErrorHandlerMiddleware
  {
      private readonly RequestDelegate _next;
      private readonly ILogger<ErrorHandlerMiddleware> _logger;

      public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
      {
          _next = next;
          _logger = logger;
      }

      public async Task InvokeAsync(HttpContext context)
      {
          try
          {
              await _next(context);
          }
          catch (Exception ex)
          {
              _logger.LogError(ex, "An error occurred");
              await HandleExceptionAsync(context, ex);
          }
      }

      private static Task HandleExceptionAsync(HttpContext context, Exception exception)
      {
          context.Response.ContentType = "application/json";
          context.Response.StatusCode = StatusCodes.Status500InternalServerError;

          var result = JsonSerializer.Serialize(new
          {
              message = "An internal server error occurred",
              details = exception.Message
          });

          return context.Response.WriteAsync(result);
      }
  }
  ```

- **Million.Api/Program.cs**
  ```csharp
  var builder = WebApplication.CreateBuilder(args);

  // Configuración MongoDB
  builder.Services.Configure<MongoDbSettings>(
      builder.Configuration.GetSection("MongoDbSettings"));

  builder.Services.AddSingleton<MongoDbContext>();
  builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();

  // CORS para desarrollo
  builder.Services.AddCors(options =>
  {
      options.AddPolicy("AllowFrontend", policy =>
      {
          policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
      });
  });

  builder.Services.AddControllers();
  builder.Services.AddEndpointsApiExplorer();
  builder.Services.AddSwaggerGen();

  var app = builder.Build();

  app.UseMiddleware<ErrorHandlerMiddleware>();

  if (app.Environment.IsDevelopment())
  {
      app.UseSwagger();
      app.UseSwaggerUI();
  }

  app.UseCors("AllowFrontend");
  app.UseAuthorization();
  app.MapControllers();

  app.Run();
  ```

##### 6. Crear Seed Data (30 min)

- **seed/properties.json** (20+ propiedades de ejemplo)

##### 7. Tests Unitarios Backend (1.5 horas)

- **Million.Tests/Unit/Repositories/PropertyRepositoryTests.cs**
  - Test: GetListAsync sin filtros retorna todas las propiedades
  - Test: GetListAsync con filtro name funciona correctamente
  - Test: GetListAsync con rango de precio funciona
  - Test: Paginación funciona correctamente

- **Million.Tests/Unit/Controllers/PropertiesControllerTests.cs**
  - Test: GetProperties retorna 200 OK con data
  - Test: GetProperty con id válido retorna 200
  - Test: GetProperty con id inválido retorna 404

---

### **Día 2 - Frontend + Integración + Deployment**

#### **Mañana (8:00 - 13:00)**

**Daily Standup** (8:00 - 8:10)

##### 1. Configurar Proyecto React (30 min)
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

##### 2. Crear API Client (30 min)

- **src/api/client.js**
  ```javascript
  import axios from 'axios';

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Interceptor para manejo de errores
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  export default apiClient;
  ```

- **src/api/propertiesApi.js**
  ```javascript
  import apiClient from './client';

  export const getProperties = ({ name, address, minPrice, maxPrice, page, pageSize }) => {
    return apiClient.get('/properties', {
      params: { name, address, minPrice, maxPrice, page, pageSize }
    });
  };

  export const getPropertyById = (id) => {
    return apiClient.get(`/properties/${id}`);
  };
  ```

##### 3. Implementar Componentes (3 horas)

- **PropertyCard**: Tarjeta de propiedad con imagen, nombre, precio
- **PropertyFilters**: Formulario con debounce
- **Pagination**: Controles de paginación
- **PropertiesList**: Página principal
- **PropertyDetail**: Página de detalle

##### 4. Custom Hooks (1 hora)

- **useDebounce**: Hook para debouncing de inputs
- **useProperties**: Hook para lógica de propiedades (fetching, filtros)

#### **Tarde (14:00 - 18:00)**

##### 5. Estilos Responsive (1.5 horas)
- CSS Modules o Tailwind
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px

##### 6. Tests Frontend (1.5 horas)
- Test: Renderizado de PropertiesList
- Test: Filtros disparan búsqueda
- Test: Paginación funciona
- Test: PropertyCard muestra datos correctos

##### 7. Docker + Integración (1.5 horas)
- Crear Dockerfile para frontend
- Actualizar docker-compose.yml
- Probar stack completo con `docker-compose up`

##### 8. Documentación Final (1.5 horas)
- README completo con:
  - Descripción del proyecto
  - Requisitos previos
  - Instrucciones de instalación (local y Docker)
  - Endpoints API con ejemplos
  - Cómo ejecutar tests
  - Troubleshooting
- Generar backup MongoDB:
  ```bash
  mongodump --uri="mongodb://localhost:27017" -d milliondb -o ./dump
  ```

---

## 5. Criterios de Evaluación (Checklist)

### Backend
- ✅ Arquitectura limpia (separación de capas)
- ✅ Filtros funcionando correctamente
- ✅ Paginación implementada
- ✅ Manejo de errores centralizado
- ✅ Swagger documentado
- ✅ Tests NUnit pasando (cobertura > 70%)
- ✅ Consultas a MongoDB optimizadas (índices)
- ✅ DTOs correctamente definidos

### Frontend
- ✅ Componentes modulares y reutilizables
- ✅ Filtros con debounce
- ✅ Paginación funcional
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states y error handling
- ✅ Tests unitarios pasando
- ✅ Código limpio y organizado

### Infraestructura
- ✅ Docker compose funcional
- ✅ Seed data incluido
- ✅ Backup MongoDB generado
- ✅ Variables de entorno configuradas

### Documentación
- ✅ README con instrucciones claras
- ✅ Comentarios en código complejo
- ✅ API documentada (Swagger)

### Git
- ✅ Commits atómicos y descriptivos
- ✅ Branches organizadas
- ✅ Sin archivos sensibles en el repo

---

## 6. Stack Tecnológico Final

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend Framework | .NET | 8.0 |
| Lenguaje Backend | C# | 11.0 |
| Base de Datos | MongoDB | 7.0 |
| ORM/Driver | MongoDB.Driver | 2.23.0 |
| Testing Backend | NUnit | 3.14.0 |
| Frontend Framework | React | 18.2.0 |
| Build Tool | Vite | 5.0.8 |
| HTTP Client | Axios | 1.6.2 |
| Routing | React Router | 6.20.0 |
| Testing Frontend | Vitest + React Testing Library | 1.0.4 |
| Containerización | Docker + Docker Compose | Latest |
| Documentación API | Swagger/OpenAPI | 6.5.0 |

---

## 7. Entregables Finales

1. **Código fuente**:
   - Repositorio GitHub: `https://github.com/[username]/million-technical-test`
   - Acceso otorgado a: `crios@millionluxury.com`

2. **Backup de base de datos**:
   - Carpeta `dump/` con mongodump
   - O archivo `seed/properties.json` para import

3. **Documentación**:
   - README.md con instrucciones completas
   - Swagger UI disponible en `/swagger`

4. **Instrucciones de ejecución**:
   ```bash
   # Opción 1: Docker (recomendado)
   docker-compose up --build

   # Opción 2: Local
   # Backend
   cd backend/Million.Api
   dotnet run

   # Frontend
   cd frontend
   npm install
   npm run dev

   # MongoDB (local)
   mongod --dbpath ./data/db
   mongoimport --db milliondb --collection properties --file seed/properties.json --jsonArray
   ```

5. **URLs de acceso**:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - Swagger: http://localhost:5000/swagger
   - MongoDB: mongodb://localhost:27017

---

## 8. Próximos Pasos (Después de la Entrega)

Mejoras potenciales para futuras iteraciones:

- [ ] Autenticación y autorización (JWT)
- [ ] Carga de imágenes a servicio cloud (S3, Cloudinary)
- [ ] Búsqueda avanzada (geolocalización, múltiples imágenes)
- [ ] Filtros adicionales (tipo de propiedad, habitaciones, etc.)
- [ ] Modo oscuro en frontend
- [ ] Internacionalización (i18n)
- [ ] Analytics y logging centralizado (Serilog + Seq)
- [ ] CI/CD con GitHub Actions o Azure DevOps
- [ ] Deploy a producción (Azure App Service + MongoDB Atlas)

---

**Autor**: Cristian Hoyos
**Fecha**: 2025
**Proyecto**: Million Luxury Technical Test
