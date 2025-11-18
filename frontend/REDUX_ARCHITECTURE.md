# Redux Architecture - Million Luxury Frontend

## Estructura de Archivos

```
frontend/src/
├── api/
│   ├── client.js              # Axios client configurado
│   ├── routes.js              # MILLION_ROUTES - rutas centralizadas
│   └── propertiesApi.js       # API service para properties
├── store/
│   ├── store.js               # Redux store configuración
│   └── properties/
│       ├── propertiesSlice.js # Redux slice con reducers y selectors
│       └── propertiesThunks.js# Thunks para llamadas API
└── pages/
    ├── PropertiesList/
    │   └── PropertiesListRedux.jsx
    └── PropertyDetail/
        └── PropertyDetailRedux.jsx
```

## Flujo de Datos

### 1. **Vista → Dispatch → Thunk → API → Slice → Vista**

```
┌─────────────────┐
│  PropertiesList │ ← selectProperties (selector)
│   (Component)   │
└────────┬────────┘
         │
         │ dispatch(fetchPropertiesThunk(params))
         ↓
┌─────────────────┐
│  propertiesThunk│ ← createAsyncThunk
│                 │
└────────┬────────┘
         │
         │ await getProperties(params)
         ↓
┌─────────────────┐
│ propertiesApi.js│ ← apiClient.get(MILLION_ROUTES.PROPERTIES.LIST)
│                 │
└────────┬────────┘
         │
         │ axios.get(http://localhost:5000/api/properties)
         ↓
┌─────────────────┐
│   API Backend   │
│   (port 5000)   │
└────────┬────────┘
         │
         │ response.data
         ↓
┌─────────────────┐
│ propertiesSlice │ ← extraReducers (pending/fulfilled/rejected)
│  (Redux State)  │
└────────┬────────┘
         │
         │ state updated
         ↓
┌─────────────────┐
│  PropertiesList │ ← Re-render con nuevos datos
│   (Component)   │
└─────────────────┘
```