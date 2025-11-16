# Arquitectura Hexagonal del Backend - Million Luxury

> **Patrón**: Hexagonal Architecture (Ports & Adapters)
> **Framework**: .NET 8
> **Autor**: Cristian Hoyos
> **Fecha**: 2025

---

## 📐 ¿Qué es Arquitectura Hexagonal?

La **Arquitectura Hexagonal** (también conocida como **Ports & Adapters**). Su objetivo principal es:

> **Aislar el dominio de negocio (core) de las dependencias externas (infraestructura, UI, frameworks).**

### Principios Fundamentales

1. **El dominio NO conoce la infraestructura** (sin dependencias de MongoDB, EF Core, HTTP, etc.)
2. **El dominio define contratos (Ports)** que la infraestructura implementa (Adapters)
3. **Inversión de dependencias**: Infrastructure depende de Core, nunca al revés
4. **Testabilidad**: El dominio puede probarse sin base de datos, API o frameworks

---

## 🏗️ Estructura del Backend

```
backend/
├── Million.Api/              🔷 ADAPTER (Puerto de Entrada - HTTP)
│   ├── Controllers/          → Controladores REST
│   ├── Middleware/           → Middleware de errores, logging
│   └── Program.cs            → Configuración de la aplicación
│
├── Million.Core/             ⬢ HEXÁGONO (Dominio Puro)
│   ├── Entities/             → Entidades de dominio (Property)
│   ├── DTOs/                 → Objetos de transferencia
│   └── Interfaces/           → PORTS (contratos que define el dominio)
│       └── IPropertyRepository.cs
│
├── Million.Infrastructure/   🔷 ADAPTER (Puerto de Salida - Persistencia)
│   ├── Models/               → Modelos de persistencia (PropertyModel)
│   ├── Mappers/              → Mappers (Domain ↔ Model)
│   ├── Data/                 → Contexto de MongoDB
│   └── Repositories/         → Implementación de IPropertyRepository
│
├── Million.Application/      🧠 CASOS DE USO (Lógica de Aplicación)
│   └── Services/             → Servicios de aplicación (orquestación)
│
└── Million.Tests/            ✅ TESTS
    └── Unit/                 → Tests unitarios (dominio aislado)
```

---

## 🔷 Capas y Responsabilidades

### 1️⃣ **Million.Core** - El Hexágono (Dominio Puro)

**Responsabilidad:** Contiene la lógica de negocio y las reglas del dominio.

**Características:**
- ✅ **SIN dependencias externas** (sin MongoDB, EF Core, ASP.NET, etc.)
- ✅ Define **entidades de dominio** puras (POCO - Plain Old CLR Objects)
- ✅ Define **interfaces (Ports)** que otros necesitan implementar
- ✅ Define **DTOs** para comunicación con el exterior
- ✅ **Altamente testeable** (no requiere infraestructura para probarse)

**Ejemplo: Entidad Property (Dominio Puro)**

```csharp
// ✅ CORRECTO: Sin dependencias de MongoDB
namespace Million.Core.Entities;

public class Property
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    // ... más propiedades
}
```

```csharp
// ❌ INCORRECTO: Dependencia de MongoDB en el dominio
using MongoDB.Bson; // ❌ NO DEBE ESTAR AQUÍ

public class Property
{
    [BsonId] // ❌ Viola arquitectura hexagonal
    public string Id { get; set; }
}
```

**Interfaces (Ports):**

```csharp
// Million.Core/Interfaces/IPropertyRepository.cs
namespace Million.Core.Interfaces;

/// <summary>
/// PORT: Contrato que define el dominio
/// La infraestructura DEBE implementarlo
/// </summary>
public interface IPropertyRepository
{
    Task<(IEnumerable<Property> properties, long totalCount)> GetListAsync(
        string? name,
        string? address,
        decimal? minPrice,
        decimal? maxPrice,
        int page,
        int pageSize
    );

    Task<Property?> GetByIdAsync(string id);
}
```

---

### 2️⃣ **Million.Infrastructure** - Adapter de Salida (Persistencia)

**Responsabilidad:** Implementa los Ports definidos por el dominio usando tecnologías concretas (MongoDB).

**Características:**
- ✅ **SÍ tiene dependencias** de MongoDB.Driver, EF Core, etc.
- ✅ Implementa interfaces del dominio (`IPropertyRepository`)
- ✅ Usa **modelos de persistencia** (`PropertyModel`) separados del dominio
- ✅ Usa **mappers** para convertir entre dominio y persistencia

**Modelo de Persistencia (PropertyModel):**

```csharp
// Million.Infrastructure/Models/PropertyModel.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Million.Infrastructure.Models;

/// <summary>
/// Modelo de persistencia para MongoDB
/// ESTE modelo SÍ puede tener atributos de MongoDB
/// </summary>
[BsonIgnoreExtraElements]
public class PropertyModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("price")]
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Price { get; set; }

    // ... más propiedades con atributos MongoDB
}
```

**Mapper (Domain ↔ Model):**

```csharp
// Million.Infrastructure/Mappers/PropertyMapper.cs
namespace Million.Infrastructure.Mappers;

public static class PropertyMapper
{
    /// <summary>
    /// Convierte PropertyModel (MongoDB) → Property (Dominio)
    /// </summary>
    public static Property ToDomain(PropertyModel model)
    {
        return new Property
        {
            Id = model.Id,
            Name = model.Name,
            Price = model.Price,
            // ... resto de propiedades
        };
    }

    /// <summary>
    /// Convierte Property (Dominio) → PropertyModel (MongoDB)
    /// </summary>
    public static PropertyModel ToModel(Property entity)
    {
        return new PropertyModel
        {
            Id = entity.Id,
            Name = entity.Name,
            Price = entity.Price,
            // ... resto de propiedades
        };
    }
}
```

**Repository (Implementación del Port):**

```csharp
// Million.Infrastructure/Repositories/PropertyRepository.cs
using Million.Core.Entities;
using Million.Core.Interfaces;
using Million.Infrastructure.Models;
using Million.Infrastructure.Mappers;
using MongoDB.Driver;

namespace Million.Infrastructure.Repositories;

/// <summary>
/// ADAPTER: Implementa el PORT (IPropertyRepository)
/// Usa MongoDB como tecnología de persistencia
/// </summary>
public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<PropertyModel> _collection;

    public PropertyRepository(MongoDbContext context)
    {
        _collection = context.Properties;
    }

    public async Task<(IEnumerable<Property> properties, long totalCount)> GetListAsync(
        string? name,
        string? address,
        decimal? minPrice,
        decimal? maxPrice,
        int page,
        int pageSize)
    {
        // 1. Construir filtros MongoDB
        var filterBuilder = Builders<PropertyModel>.Filter;
        var filters = new List<FilterDefinition<PropertyModel>>
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

        // 2. Ejecutar queries MongoDB
        var totalCount = await _collection.CountDocumentsAsync(combinedFilter);

        var models = await _collection
            .Find(combinedFilter)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        // 3. ✅ Mapear de PropertyModel (Infrastructure) → Property (Domain)
        var properties = PropertyMapper.ToDomainList(models);

        return (properties, totalCount);
    }

    public async Task<Property?> GetByIdAsync(string id)
    {
        var model = await _collection
            .Find(p => p.Id == id && p.Enabled)
            .FirstOrDefaultAsync();

        // ✅ Mapear de Model → Domain
        return model != null ? PropertyMapper.ToDomain(model) : null;
    }
}
```

---

### 3️⃣ **Million.Api** - Adapter de Entrada (HTTP/REST)

**Responsabilidad:** Expone la aplicación al mundo exterior vía HTTP (REST API).

**Características:**
- ✅ Controllers reciben requests HTTP
- ✅ Usan dependencias del dominio (IPropertyRepository)
- ✅ Mapean de Domain Entities → DTOs para respuestas
- ✅ Configuran CORS, Swagger, Middleware

**Controller:**

```csharp
// Million.Api/Controllers/PropertiesController.cs
using Million.Core.Interfaces;
using Million.Core.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Million.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyRepository _repository; // ✅ Depende del PORT, no del Adapter

    public PropertiesController(IPropertyRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<PropertyListResponseDto>> GetProperties(
        [FromQuery] string? name,
        [FromQuery] string? address,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        pageSize = Math.Min(pageSize, 50); // Limitar máximo

        var (properties, totalCount) = await _repository.GetListAsync(
            name, address, minPrice, maxPrice, page, pageSize
        );

        // Mapear Domain → DTO
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
}
```

---

### 4️⃣ **Million.Application** - Casos de Uso (Lógica de Aplicación)

**Responsabilidad:** Orquesta casos de uso complejos que involucran múltiples dominios.

**Características:**
- ✅ Servicios de aplicación que coordinan múltiples repositorios
- ✅ Validaciones de negocio complejas
- ✅ Transacciones y consistencia

**Ejemplo:**

```csharp
// Million.Application/Services/PropertyService.cs
namespace Million.Application.Services;

public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IOwnerRepository _ownerRepository; // Si tuviéramos

    public PropertyService(IPropertyRepository propertyRepository)
    {
        _propertyRepository = propertyRepository;
    }

    public async Task<PropertyDto> CreatePropertyAsync(CreatePropertyDto dto)
    {
        // Validaciones de negocio
        // Orquestación de múltiples operaciones
        // Transacciones, etc.
    }
}
```

---

## 🔄 Flujo de Datos (Request → Response)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUJO HEXAGONAL                         │
└─────────────────────────────────────────────────────────────────┘

1. REQUEST HTTP
   │
   ├─→ [PropertiesController] (Million.Api - Adapter Entrada)
   │    │
   │    ├─→ Llama a: IPropertyRepository.GetListAsync()
   │    │            (Million.Core - Port)
   │    │
   │    ↓
   │
2. REPOSITORIO
   │
   ├─→ [PropertyRepository] (Million.Infrastructure - Adapter Salida)
   │    │
   │    ├─→ Consulta MongoDB usando PropertyModel
   │    │
   │    ├─→ PropertyMapper.ToDomain(models)
   │    │    (Convierte PropertyModel → Property)
   │    │
   │    └─→ Retorna: IEnumerable<Property> (Dominio)
   │
   ↓
3. MAPEO A DTO
   │
   ├─→ [Controller] Mapea Property → PropertyDto
   │
   └─→ RESPONSE HTTP (JSON con PropertyListResponseDto)
```

---

## ✅ Ventajas de esta Arquitectura

### 1. **Independencia de Frameworks**
El dominio no depende de MongoDB, ASP.NET, etc. Puedes cambiar de MongoDB a PostgreSQL sin tocar el dominio.

### 2. **Testabilidad**
```csharp
// Test unitario SIN base de datos
[Test]
public void Property_Should_Have_Valid_Price()
{
    // Arrange
    var property = new Property { Price = 100000 };

    // Act & Assert
    Assert.That(property.Price, Is.GreaterThan(0));
}

// Test con mock del repository
[Test]
public async Task GetProperties_Should_Return_Filtered_List()
{
    // Arrange
    var mockRepo = new Mock<IPropertyRepository>();
    mockRepo.Setup(r => r.GetListAsync(It.IsAny<string>(), ...))
            .ReturnsAsync((new List<Property> { ... }, 10));

    var controller = new PropertiesController(mockRepo.Object);

    // Act
    var result = await controller.GetProperties(name: "Casa");

    // Assert
    Assert.That(result.Value.Data.Count, Is.EqualTo(10));
}
```

### 3. **Mantenibilidad**
Cada capa tiene una responsabilidad clara. Cambios en infraestructura no afectan el dominio.

### 4. **Escalabilidad**
Puedes agregar nuevos adapters sin modificar el core:
- Adapter de eventos (RabbitMQ, Kafka)
- Adapter de caché (Redis)
- Adapter de notificaciones (SendGrid)

---

## 🚫 Anti-Patrones a Evitar

### ❌ **1. Dominio con dependencias de infraestructura**

```csharp
// ❌ MAL: Entidad con atributos MongoDB
using MongoDB.Bson; // ← NO debe estar en Core

public class Property
{
    [BsonId] // ← Violación de arquitectura hexagonal
    public string Id { get; set; }
}
```

### ❌ **2. Adapter que no usa el Port**

```csharp
// ❌ MAL: Controller usa directamente PropertyRepository
public class PropertiesController
{
    private readonly PropertyRepository _repo; // ← Acoplamiento directo

    // ✅ BIEN: Controller usa IPropertyRepository (Port)
    private readonly IPropertyRepository _repo; // ← Inversión de dependencias
}
```

### ❌ **3. Lógica de negocio en el Adapter**

```csharp
// ❌ MAL: Validación en el Controller
[HttpPost]
public async Task<IActionResult> Create(PropertyDto dto)
{
    if (dto.Price < 0) // ← Lógica de negocio en controller
        return BadRequest();
}

// ✅ BIEN: Validación en el Dominio o Application
public class Property
{
    public void SetPrice(decimal price)
    {
        if (price < 0)
            throw new DomainException("Price must be positive");
        Price = price;
    }
}
```

---

## 📊 Diagrama de Dependencias

```
┌───────────────────────────────────────────────────────────┐
│                   ARQUITECTURA HEXAGONAL                  │
└───────────────────────────────────────────────────────────┘

                     ┌──────────────────┐
                     │   Million.Api    │  ← Adapter Entrada (HTTP)
                     │   (Controllers)  │
                     └────────┬─────────┘
                              │ depende de
                              ↓
        ┌─────────────────────────────────────────┐
        │         Million.Core (HEXÁGONO)         │  ← Dominio Puro
        │  ┌─────────────────────────────────┐    │
        │  │ Entities (Property)             │    │
        │  │ DTOs (PropertyDto)              │    │
        │  │ Interfaces (IPropertyRepository)│    │  ← PORTS
        │  └─────────────────────────────────┘    │
        └──────────────────┬──────────────────────┘
                           ↑
                           │ implementa
                           │
              ┌────────────┴──────────────┐
              │  Million.Infrastructure   │  ← Adapter Salida (MongoDB)
              │  - Models (PropertyModel) │
              │  - Mappers                │
              │  - Repositories           │
              └───────────────────────────┘

REGLA: Las flechas apuntan HACIA EL DOMINIO (Core)
       Infrastructure y Api DEPENDEN de Core
       Core NO depende de nadie
```

---

## 🎯 Checklist de Arquitectura Hexagonal

- ✅ **Dominio (Core) NO tiene dependencias externas** (sin MongoDB, ASP.NET, etc.)
- ✅ **Dominio define Ports (interfaces)** que Infrastructure implementa
- ✅ **Infrastructure tiene modelos de persistencia** separados del dominio
- ✅ **Mappers convierten** entre Domain y Models
- ✅ **Controllers usan Ports**, no implementaciones concretas
- ✅ **Inyección de dependencias** registra Adapters en Program.cs
- ✅ **Tests unitarios** pueden probar el dominio sin base de datos

---

## 📚 Referencias

- **Hexagonal Architecture** - Alistair Cockburn: https://alistair.cockburn.us/hexagonal-architecture/
- **Clean Architecture** - Robert C. Martin (Uncle Bob)
- **Domain-Driven Design** - Eric Evans
- **Ports and Adapters Pattern** - https://herbertograca.com/2017/09/14/ports-adapters-architecture/

---

**Autor**: Cristian Hoyos
**Proyecto**: Million Luxury Technical Test
**Fecha**: 2025
**Patrón**: Hexagonal Architecture (Ports & Adapters)
