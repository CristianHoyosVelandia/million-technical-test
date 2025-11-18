import { createSlice } from '@reduxjs/toolkit';
import { fetchPropertiesThunk, fetchPropertyByIdThunk } from './propertiesThunks';

// Properties Redux Slice
const initialState = {
  // Properties List State
  properties: [],
  meta: null,
  loading: false,
  error: null,

  // Single Property State
  selectedProperty: null,
  selectedLoading: false,
  selectedError: null,

  // Filters State
  filters: {
    name: '',
    address: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    pageSize: 9,
  },
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // Actions
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: 1,
      };
    },

    setPage: (state, action) => {
      state.filters.page = action.payload;
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
      state.selectedError = null;
    },

    clearErrors: (state) => {
      state.error = null;
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    // extraReducers sirve para manejar acciones que NO fueron creadas dentro del slice
    // Son los casos de los thunks donde la peticion puede estar en 3 estados: pending, fulfilled, rejected
    builder
      .addCase(fetchPropertiesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertiesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.data || [];
        state.meta = action.payload.meta || null;
        state.error = null;
      })
      .addCase(fetchPropertiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar las propiedades';
        state.properties = [];
        state.meta = null;
      });

    builder
      .addCase(fetchPropertyByIdThunk.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchPropertyByIdThunk.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedProperty = action.payload;
        state.selectedError = null;
      })
      .addCase(fetchPropertyByIdThunk.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload?.message || 'Propiedad no encontrada';
        state.selectedProperty = null;
      });
  },
});

// Export actions
export const { setFilters, setPage, clearFilters, clearSelectedProperty, clearErrors } = propertiesSlice.actions;

// Export selectors
export const selectProperties = (state) => state.properties.properties;
export const selectPropertiesMeta = (state) => state.properties.meta;
export const selectPropertiesLoading = (state) => state.properties.loading;
export const selectPropertiesError = (state) => state.properties.error;
export const selectFilters = (state) => state.properties.filters;

export const selectSelectedProperty = (state) => state.properties.selectedProperty;
export const selectSelectedLoading = (state) => state.properties.selectedLoading;
export const selectSelectedError = (state) => state.properties.selectedError;


export default propertiesSlice.reducer;
