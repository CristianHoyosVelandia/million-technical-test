/**
 * Properties API WebServices Tests
 *
 * Tests para verificar la integración con el backend API.
 * Cubre:
 * - getProperties (con y sin filtros)
 * - getPropertyById
 * - Manejo de errores
 * - Parámetros de paginación
 */

// Mock del client ANTES de importar
jest.mock('./client');

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import apiClient from './client';
import { getProperties, getPropertyById } from './propertiesApi';

describe('Properties API WebServices', () => {
  let mock;

  beforeEach(() => {
    // Crear mock de axios
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    // Limpiar mocks después de cada test
    mock.restore();
  });

  describe('getProperties', () => {
    it('should fetch properties without filters', async () => {
      // Arrange: Mock response
      const mockResponse = {
        data: [
          {
            id: '1',
            idOwner: 'owner1',
            name: 'Casa Moderna',
            address: 'Calle 123, Bogotá',
            price: 500000000,
            imageUrl: 'https://example.com/image1.jpg'
          },
          {
            id: '2',
            idOwner: 'owner2',
            name: 'Apartamento Lujoso',
            address: 'Carrera 45, Medellín',
            price: 300000000,
            imageUrl: 'https://example.com/image2.jpg'
          }
        ],
        meta: {
          page: 1,
          pageSize: 12,
          totalCount: 2,
          totalPages: 1
        }
      };

      mock.onGet('/properties').reply(200, mockResponse);

      // Act: Llamar al servicio
      const result = await getProperties();

      // Assert: Verificar resultado
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe('Casa Moderna');
      expect(result.meta.totalCount).toBe(2);
    });

    it('should fetch properties with name filter', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: '1',
            idOwner: 'owner1',
            name: 'Casa Moderna',
            address: 'Calle 123, Bogotá',
            price: 500000000,
            imageUrl: 'https://example.com/image1.jpg'
          }
        ],
        meta: {
          page: 1,
          pageSize: 12,
          totalCount: 1,
          totalPages: 1
        }
      };

      mock.onGet('/properties', { params: { name: 'Casa' } }).reply(200, mockResponse);

      // Act
      const result = await getProperties({ name: 'Casa' });

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toContain('Casa');
    });

    it('should fetch properties with address filter', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: '1',
            idOwner: 'owner1',
            name: 'Casa Moderna',
            address: 'Calle 123, Bogotá',
            price: 500000000,
            imageUrl: 'https://example.com/image1.jpg'
          }
        ],
        meta: {
          page: 1,
          pageSize: 12,
          totalCount: 1,
          totalPages: 1
        }
      };

      mock.onGet('/properties', { params: { address: 'Bogotá' } }).reply(200, mockResponse);

      // Act
      const result = await getProperties({ address: 'Bogotá' });

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].address).toContain('Bogotá');
    });

    it('should fetch properties with price range filter', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: '1',
            idOwner: 'owner1',
            name: 'Casa Económica',
            address: 'Calle 123, Bogotá',
            price: 200000000,
            imageUrl: 'https://example.com/image1.jpg'
          }
        ],
        meta: {
          page: 1,
          pageSize: 12,
          totalCount: 1,
          totalPages: 1
        }
      };

      const params = { minPrice: 100000000, maxPrice: 300000000 };
      mock.onGet('/properties', { params }).reply(200, mockResponse);

      // Act
      const result = await getProperties(params);

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].price).toBeGreaterThanOrEqual(100000000);
      expect(result.data[0].price).toBeLessThanOrEqual(300000000);
    });

    it('should fetch properties with multiple filters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          {
            id: '1',
            idOwner: 'owner1',
            name: 'Casa Moderna',
            address: 'Calle 123, Bogotá',
            price: 250000000,
            imageUrl: 'https://example.com/image1.jpg'
          }
        ],
        meta: {
          page: 1,
          pageSize: 12,
          totalCount: 1,
          totalPages: 1
        }
      };

      const params = {
        name: 'Casa',
        address: 'Bogotá',
        minPrice: 200000000,
        maxPrice: 300000000
      };

      mock.onGet('/properties', { params }).reply(200, mockResponse);

      // Act
      const result = await getProperties(params);

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toContain('Casa');
      expect(result.data[0].address).toContain('Bogotá');
    });

    it('should handle pagination parameters', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', idOwner: 'owner1', name: 'Property 1', address: 'Address 1', price: 100000000, imageUrl: '' },
          { id: '2', idOwner: 'owner2', name: 'Property 2', address: 'Address 2', price: 200000000, imageUrl: '' },
          { id: '3', idOwner: 'owner3', name: 'Property 3', address: 'Address 3', price: 300000000, imageUrl: '' }
        ],
        meta: {
          page: 2,
          pageSize: 3,
          totalCount: 10,
          totalPages: 4
        }
      };

      const params = { page: 2, pageSize: 3 };
      mock.onGet('/properties', { params }).reply(200, mockResponse);

      // Act
      const result = await getProperties(params);

      // Assert
      expect(result.meta.page).toBe(2);
      expect(result.meta.pageSize).toBe(3);
      expect(result.meta.totalPages).toBe(4);
      expect(result.data).toHaveLength(3);
    });

    it('should return empty array when no properties found', async () => {
      // Arrange
      const mockResponse = {
        data: [],
        meta: {
          page: 1,
          pageSize: 12,
          totalCount: 0,
          totalPages: 0
        }
      };

      mock.onGet('/properties').reply(200, mockResponse);

      // Act
      const result = await getProperties();

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.meta.totalCount).toBe(0);
    });

    it('should handle API error gracefully', async () => {
      // Arrange
      mock.onGet('/properties').reply(500, {
        message: 'Internal server error'
      });

      // Act & Assert
      await expect(getProperties()).rejects.toThrow();
    });

    it('should handle network error', async () => {
      // Arrange
      mock.onGet('/properties').networkError();

      // Act & Assert
      await expect(getProperties()).rejects.toThrow();
    });
  });

  describe('getPropertyById', () => {
    it('should fetch single property by ID', async () => {
      // Arrange
      const mockProperty = {
        id: '507f1f77bcf86cd799439011',
        idOwner: 'owner123',
        name: 'Villa de Lujo',
        address: 'Calle Principal 123, Bogotá, Colombia',
        price: 850000000,
        imageUrl: 'https://example.com/villa.jpg'
      };

      mock.onGet('/properties/507f1f77bcf86cd799439011').reply(200, mockProperty);

      // Act
      const result = await getPropertyById('507f1f77bcf86cd799439011');

      // Assert
      expect(result).toEqual(mockProperty);
      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result.name).toBe('Villa de Lujo');
      expect(result.price).toBe(850000000);
    });

    it('should handle 404 when property not found', async () => {
      // Arrange
      const invalidId = 'invalid-id-123';
      mock.onGet(`/properties/${invalidId}`).reply(404, {
        message: 'Propiedad no encontrada'
      });

      // Act & Assert
      await expect(getPropertyById(invalidId)).rejects.toThrow();
    });

    it('should handle invalid MongoDB ObjectId format', async () => {
      // Arrange
      const invalidId = 'not-a-valid-objectid';
      mock.onGet(`/properties/${invalidId}`).reply(400, {
        message: 'Invalid ObjectId format'
      });

      // Act & Assert
      await expect(getPropertyById(invalidId)).rejects.toThrow();
    });

    it('should handle server error on getPropertyById', async () => {
      // Arrange
      const propertyId = '507f1f77bcf86cd799439011';
      mock.onGet(`/properties/${propertyId}`).reply(500, {
        message: 'Internal server error'
      });

      // Act & Assert
      await expect(getPropertyById(propertyId)).rejects.toThrow();
    });
  });

  describe('API Client Configuration', () => {
    it('should have correct base URL', () => {
      // Assert
      expect(apiClient.defaults.baseURL).toBe('http://localhost:5000/api');
    });

    it('should have correct timeout', () => {
      // Assert
      expect(apiClient.defaults.timeout).toBe(10000);
    });

    it('should have correct content type header', () => {
      // Assert
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    });
  });
});
