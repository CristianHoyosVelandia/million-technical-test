# Arquitectura Hexagonal - Million Luxury API

## Resumen

Este proyecto implementa una **Arquitectura Hexagonal** (también conocida como Ports & Adapters) que separa la lógica de negocio de las dependencias externas, facilitando el mantenimiento y las pruebas.

---

## Estructura del Proyecto

```
backend/
├── Million.Api/              # Adaptador de entrada (HTTP/REST)
├── Million.Core/             # Núcleo del dominio (entidades, interfaces)
├── Million.Infrastructure/   # Adaptadores de salida (MongoDB, repositorios)
├── Million.Application/      # Lógica de negocio y casos de uso
└── Million.Tests/            # Tests unitarios
```

---

## Capas y Responsabilidades

### 1. **Core (Dominio)** - `Million.Core/`
**Responsabilidad**: Contiene las entidades de negocio y define los contratos (interfaces).

**Archivos clave**:
- `Entities/Property.cs` - Modelo de dominio de Property
- `DTOs/PropertyDto.cs` - DTO para comunicación externa
- `Interfaces/IPropertyRepository.cs` - Contrato del repositorio

**Dependencias**: ❌ Ninguna (núcleo independiente)

**Cuándo modificar**:
- Agregar nuevos campos a las entidades
- Crear nuevos DTOs
- Definir nuevos contratos de repositorios

---

### 2. **Infrastructure (Adaptadores de Salida)** - `Million.Infrastructure/`
**Responsabilidad**: Implementa la comunicación con servicios externos (base de datos, APIs).

**Archivos clave**:
- `Data/MongoDbContext.cs` - Conexión a MongoDB
- `Repositories/PropertyRepository.cs` - Implementación de `IPropertyRepository`
- `Configuration/MongoDbSettings.cs` - Configuración de MongoDB

**Dependencias**: ✅ `Million.Core` (implementa sus interfaces)

**Cuándo modificar**:
- Cambiar de base de datos (MongoDB → PostgreSQL)
- Modificar queries o filtros
- Agregar nuevos repositorios

---

### 3. **Application (Casos de Uso)** - `Million.Application/`
**Responsabilidad**: Orquesta la lógica de negocio y coordina entre capas.

**Estado actual**: Capa preparada pero sin servicios complejos (lógica directa en controllers por simplicidad).

**Cuándo usar**:
- Agregar validaciones de negocio complejas
- Implementar transacciones
- Coordinar múltiples repositorios

---

### 4. **Api (Adaptador de Entrada)** - `Million.Api/`
**Responsabilidad**: Expone endpoints HTTP y maneja peticiones/respuestas.

**Archivos clave**:
- `Controllers/PropertiesController.cs` - Endpoints REST
- `Middleware/ErrorHandlerMiddleware.cs` - Manejo centralizado de errores
- `Program.cs` - Configuración de la aplicación

**Dependencias**: ✅ `Million.Core`, `Million.Infrastructure`

**Cuándo modificar**:
- Agregar nuevos endpoints
- Modificar el formato de respuestas
- Configurar middleware o CORS

---

## Flujo de una Petición

```
1. HTTP Request → PropertiesController (Million.Api)
                      ↓
2. Controller usa → IPropertyRepository (Million.Core - contrato)
                      ↓
3. Implementación → PropertyRepository (Million.Infrastructure)
                      ↓
4. Acceso a datos → MongoDB (MongoDbContext)
                      ↓
5. Response DTO ← PropertyDto → JSON
```

---

## Ventajas de esta Arquitectura

✅ **Testeable**: Puedes mockear `IPropertyRepository` sin necesidad de MongoDB
✅ **Mantenible**: Cambios en MongoDB no afectan la lógica de negocio
✅ **Flexible**: Fácil cambiar de base de datos o agregar caché
✅ **Independiente**: El Core no conoce detalles de implementación

---

## Reglas de Dependencia

```
┌─────────────────────────────────────────┐
│           Million.Api                   │
│    (Depende de Core + Infrastructure)   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│      Million.Infrastructure              │
│        (Depende solo de Core)            │
└──────────────┬───────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│          Million.Core                    │
│       (NO depende de nadie)              │
└──────────────────────────────────────────┘
```


**Desarrollador**: Cristian Hoyos
**Proyecto**: Million Luxury Technical Test
**Año**: 2025
