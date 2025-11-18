import { createSlice } from '@reduxjs/toolkit';
import { fetchPropertiesThunk, fetchPropertyByIdThunk } from './propertiesThunks';

/**
 * Properties Redux Slice
 * Manages the state for properties list and selected property.
 * Handles loading states, errors, and data from API calls.
 */

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
    pageSize: 9, // Reducido de 12 a 9 para mejor rendimiento (3x3 grid)
  },
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    /**
     * Updates filter values, Resets page to 1 when filters change
     */
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: 1,
      };
    },

    /**
     * Updates only the page number Used for pagination navigation
     */
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },

    /**
     * Clears all filters and resets to initial state
     */
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    /**
     * Clears selected property Used when navigating away from detail page
     */
    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
      state.selectedError = null;
    },

    /**
     * Clears any errors in the state
     */
    clearErrors: (state) => {
      state.error = null;
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Properties List
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

    // Fetch Property By ID
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
