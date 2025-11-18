import apiClient from './client';

/**
 * Obtiene lista de propiedades con filtros y paginación
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.name - Nombre de la propiedad (búsqueda parcial)
 * @param {string} params.address - Dirección (búsqueda parcial)
 * @param {number} params.minPrice - Precio mínimo
 * @param {number} params.maxPrice - Precio máximo
 * @param {number} params.page - Número de página (default: 1)
 * @param {number} params.pageSize - Elementos por página (default: 10)
 * @returns {Promise} Response con data y meta
 */
export const getProperties = async (params = {}) => {
  const response = await apiClient.get('/properties', { params });
  return response.data;
};

/**
 * Obtiene una propiedad específica por ID
 * @param {string} id - ID de la propiedad (MongoDB ObjectId)
 * @returns {Promise} Datos de la propiedad
 */
export const getPropertyById = async (id) => {
  const response = await apiClient.get(`/properties/${id}`);
  return response.data;
};
