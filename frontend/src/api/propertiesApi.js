import apiClient from './client';
import { MILLION_ROUTES } from './routes';

// Properties API Service

/**
 * Fetches a paginated list of properties with optional filters
 *
 * @param {Object} params - Query parameters
 * @param {string} params.name - Filter by property name
 * @param {string} params.address - Filter by address
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 12)
 * @returns {Promise<Object>} Response with data and metadata
 */
export const getProperties = async (params = {}) => {
  const response = await apiClient.get(MILLION_ROUTES.PROPERTIES.LIST, { params });
  return response.data;
};

/**
 * Fetches a single property by ID
 * @param {string} id - Property ID
 * @returns {Promise<Object>} Property data
 */
export const getPropertyById = async (id) => {
  const response = await apiClient.get(MILLION_ROUTES.PROPERTIES.BY_ID(id));
  return response.data;
};
