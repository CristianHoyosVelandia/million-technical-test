import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProperties, getPropertyById } from '../../api/propertiesApi';

/**
 * Properties Thunks
 * Redux Toolkit async thunks for handling property-related API calls.
 * Thunks automatically dispatch pending/fulfilled/rejected actions.
 */

/**
 * Fetch Properties List Thunk
 *
 * Fetches a paginated list of properties with optional filters.
 * Dispatches actions: fetchProperties/pending, fetchProperties/fulfilled, fetchProperties/rejected
 *
 * @param {Object} params - Query parameters
 * @param {string} params.name - Filter by property name
 * @param {string} params.address - Filter by address
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 12)
 *
 * @example
 * dispatch(fetchPropertiesThunk({ page: 1, pageSize: 12, name: 'villa' }))
 */
export const fetchPropertiesThunk = createAsyncThunk(
  'properties/fetchProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getProperties(params);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Error al cargar las propiedades',
        status: error.response?.status,
      });
    }
  }
);

/**
 * Fetch Property By ID Thunk
 *
 * Fetches a single property by its ID.
 * Dispatches actions: fetchPropertyById/pending, fetchPropertyById/fulfilled, fetchPropertyById/rejected
 *
 * @param {string} id - Property ID (MongoDB ObjectId)
 *
 * @example
 * dispatch(fetchPropertyByIdThunk('507f1f77bcf86cd799439011'))
 */
export const fetchPropertyByIdThunk = createAsyncThunk(
  'properties/fetchPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getPropertyById(id);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Propiedad no encontrada',
        status: error.response?.status,
      });
    }
  }
);
