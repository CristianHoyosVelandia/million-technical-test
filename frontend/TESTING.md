# Testing Guide - Million Luxury Frontend

## 📋 Overview

El frontend de Million Luxury cuenta con **16 tests automatizados** usando **Jest** para verificar la integración con el backend API.

## 🧪 Test Framework

- **Framework**: Jest 30.2.0
- **Mocking**: axios-mock-adapter 2.1.0
- **Testing Library**: @testing-library/react 16.3.0
- **Environment**: jsdom

## 🚀 Ejecutar Tests

### Comando básico
```bash
npm test
```

### Watch mode (desarrollo)
```bash
npm run test:watch
```

### Con cobertura de código
```bash
npm run test:coverage
```

## 📁 Estructura de Tests

```
frontend/
├── src/
│   ├── api/
│   │   ├── __mocks__/
│   │   │   └── client.js          # Mock del API client
│   │   ├── propertiesApi.test.js  # 16 tests de WebServices
│   │   ├── client.js
│   │   └── propertiesApi.js
│   └── setupTests.js               # Configuración global
├── __mocks__/
│   └── fileMock.js                 # Mock de archivos estáticos
├── jest.config.js                  # Configuración de Jest
└── babel.config.js                 # Configuración de Babel
```

## ✅ Tests Implementados (16 total)

### 1. getProperties - 9 tests

#### ✓ should fetch properties without filters
**Descripción**: Verifica que se puedan obtener propiedades sin aplicar filtros.

**Cobertura**:
- Response structure válida
- Array de propiedades retornado
- Metadata de paginación presente

#### ✓ should fetch properties with name filter
**Descripción**: Verifica filtrado por nombre de propiedad.

**Parámetros testeados**: `{ name: 'Casa' }`

#### ✓ should fetch properties with address filter
**Descripción**: Verifica filtrado por dirección.

**Parámetros testeados**: `{ address: 'Bogotá' }`

#### ✓ should fetch properties with price range filter
**Descripción**: Verifica filtrado por rango de precios (min/max).

**Parámetros testeados**:
```javascript
{
  minPrice: 100000000,
  maxPrice: 300000000
}
```

#### ✓ should fetch properties with multiple filters
**Descripción**: Verifica combinación de múltiples filtros simultáneos.

**Parámetros testeados**:
```javascript
{
  name: 'Casa',
  address: 'Bogotá',
  minPrice: 200000000,
  maxPrice: 300000000
}
```

#### ✓ should handle pagination parameters
**Descripción**: Verifica que la paginación funcione correctamente.

**Parámetros testeados**:
```javascript
{
  page: 2,
  pageSize: 3
}
```

**Validaciones**:
- `meta.page` correcto
- `meta.pageSize` correcto
- `meta.totalPages` calculado
- Array de resultados con tamaño correcto

#### ✓ should return empty array when no properties found
**Descripción**: Verifica manejo de resultados vacíos.

**Validaciones**:
- `data` es array vacío `[]`
- `meta.totalCount` es `0`
- `meta.totalPages` es `0`

#### ✓ should handle API error gracefully
**Descripción**: Verifica manejo de errores del servidor (500).

**Comportamiento esperado**: Promise rechazada con error

#### ✓ should handle network error
**Descripción**: Verifica manejo de errores de red.

**Comportamiento esperado**: Promise rechazada con error

---

### 2. getPropertyById - 4 tests

#### ✓ should fetch single property by ID
**Descripción**: Verifica obtención de propiedad individual por ID.

**ID testeado**: `507f1f77bcf86cd799439011` (MongoDB ObjectId válido)

**Validaciones**:
- Objeto de propiedad retornado
- Todos los campos presentes (id, idOwner, name, address, price, imageUrl)

#### ✓ should handle 404 when property not found
**Descripción**: Verifica respuesta cuando la propiedad no existe.

**Status code esperado**: 404

#### ✓ should handle invalid MongoDB ObjectId format
**Descripción**: Verifica validación de formato de ID.

**ID inválido testeado**: `not-a-valid-objectid`

**Status code esperado**: 400

#### ✓ should handle server error on getPropertyById
**Descripción**: Verifica manejo de errores del servidor en detalle.

**Status code testeado**: 500

---

### 3. API Client Configuration - 3 tests

#### ✓ should have correct base URL
**Descripción**: Verifica que el cliente esté configurado con la URL correcta.

**Valor esperado**: `http://localhost:5000/api`

#### ✓ should have correct timeout
**Descripción**: Verifica timeout de requests.

**Valor esperado**: `10000` ms (10 segundos)

#### ✓ should have correct content type header
**Descripción**: Verifica header Content-Type.

**Valor esperado**: `application/json`

---

## 📊 Cobertura de Tests

### Por Funcionalidad

| Funcionalidad | Tests | Estado |
|---------------|-------|--------|
| Listar propiedades sin filtros | 1 | ✅ |
| Filtro por nombre | 1 | ✅ |
| Filtro por dirección | 1 | ✅ |
| Filtro por rango de precio | 1 | ✅ |
| Filtros combinados | 1 | ✅ |
| Paginación | 1 | ✅ |
| Resultados vacíos | 1 | ✅ |
| Error de API (500) | 1 | ✅ |
| Error de red | 1 | ✅ |
| Detalle de propiedad | 1 | ✅ |
| Propiedad no encontrada (404) | 1 | ✅ |
| ID inválido (400) | 1 | ✅ |
| Error en detalle (500) | 1 | ✅ |
| Configuración de cliente | 3 | ✅ |
| **TOTAL** | **16** | ✅ |

### Por Categoría

- **Filtros**: 5 tests (name, address, price range, multiple, pagination)
- **Error Handling**: 5 tests (API error, network error, 404, 400, 500)
- **Happy Path**: 3 tests (list, detail, empty)
- **Configuration**: 3 tests (base URL, timeout, headers)

---

## 🔧 Configuración

### jest.config.js

```javascript
export default {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { modules: 'commonjs' }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### setupTests.js

```javascript
import '@testing-library/jest-dom';

// Variables de entorno para tests
process.env.VITE_API_BASE_URL = 'http://localhost:5000/api';

// Mock de console para tests limpios
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
```

---

## 🎯 Ejemplos de Uso

### Test de Filtro por Nombre
```javascript
it('should fetch properties with name filter', async () => {
  // Arrange: Mock response
  const mockResponse = {
    data: [{ id: '1', name: 'Casa Moderna', ... }],
    meta: { page: 1, totalCount: 1, ... }
  };

  mock.onGet('/properties', { params: { name: 'Casa' } })
    .reply(200, mockResponse);

  // Act: Llamar al servicio
  const result = await getProperties({ name: 'Casa' });

  // Assert: Verificar resultado
  expect(result.data).toHaveLength(1);
  expect(result.data[0].name).toContain('Casa');
});
```

### Test de Error Handling
```javascript
it('should handle 404 when property not found', async () => {
  // Arrange
  mock.onGet('/properties/invalid-id')
    .reply(404, { message: 'Propiedad no encontrada' });

  // Act & Assert
  await expect(getPropertyById('invalid-id')).rejects.toThrow();
});
```

---

## 🚨 Troubleshooting

### Error: "Cannot use 'import.meta' outside a module"

**Solución**: Usar el mock de `client.js` en `src/api/__mocks__/client.js`

```javascript
// En el test
jest.mock('./client');
```

### Error: "moduleNameMapper" no resuelve imports

**Solución**: Agregar mapping en `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Tests no encuentran setupTests.js

**Solución**: Verificar `setupFilesAfterEnv` en `jest.config.js`:

```javascript
setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
```

---

## 📈 Mejoras Futuras

### Tests Pendientes (Opcionales)

1. **Tests de Componentes React**
   - PropertyCard rendering
   - PropertyFilters interacción
   - Pagination clicks

2. **Tests de Redux**
   - propertiesSlice reducers
   - propertiesThunks async actions
   - Selectors

3. **Tests E2E**
   - User flow completo
   - Navegación entre páginas
   - Interacción con filtros

4. **Performance Tests**
   - Renderizado de 100+ propiedades
   - Debounce de filtros
   - Memoization effectiveness

---

## 📝 Comandos Útiles

```bash
# Ejecutar tests una vez
npm test

# Watch mode (re-ejecuta al guardar)
npm run test:watch

# Coverage report HTML
npm run test:coverage
open coverage/lcov-report/index.html

# Ejecutar solo un archivo
npm test propertiesApi.test.js

# Ejecutar tests con pattern
npm test -- --testNamePattern="should fetch"

# Verbose output
npm test -- --verbose

# Update snapshots (si se usan)
npm test -- --updateSnapshot
```

---

## ✅ Checklist de Testing

Antes de hacer commit/push, verificar:

- [ ] Todos los tests pasan: `npm test`
- [ ] No hay console.errors no manejados
- [ ] Coverage mínimo: 70% en todas las métricas
- [ ] Tests son determinísticos (no flaky)
- [ ] Mocks están correctamente configurados
- [ ] Setup/teardown de tests (beforeEach/afterEach)

---

**Autor**: Cristian Hoyos
**Proyecto**: Million Luxury
**Fecha**: 2025
**Versión**: 1.0
**Tests**: 16 passing ✅
