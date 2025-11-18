import { useState, useEffect, useCallback } from 'react';
import { getProperties } from '../../api/propertiesApi';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PropertyFilters from './PropertyFilters';
import Pagination from '../../components/Pagination/Pagination';
import styles from './PropertiesList.module.css';

/**
 * PropertiesList Page Component (US-020)
 *
 * Main page for displaying paginated property listings with filters.
 *
 * Features:
 * - Property grid with responsive layout
 * - Filter controls (name, address, price range)
 * - Pagination navigation (US-019)
 * - Loading, error, and empty states
 * - Results counter
 * - Auto-refresh on filter/page changes
 *
 * User Stories:
 * - US-020: Display property list with filters and pagination
 * - US-019: Integrate pagination component
 * - US-018: Integrate filter controls
 * - US-017: Display property cards
 */
const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    pageSize: 12,
  });

  /**
   * Fetches properties from API with current filters and pagination
   * Uses useCallback to prevent infinite re-renders
   */
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build API query params, excluding empty values
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.address) params.address = filters.address;
      if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      params.page = filters.page;
      params.pageSize = filters.pageSize;

      const response = await getProperties(params);
      setProperties(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError('Error al cargar las propiedades. Por favor intenta de nuevo.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.name, filters.address, filters.minPrice, filters.maxPrice, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  /**
   * Handles filter changes from PropertyFilters component
   * Resets to page 1 when filters change
   */
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  /**
   * Handles page navigation from Pagination component (US-019)
   * Scrolls to top for better UX
   */
  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Propiedades Disponibles</h1>
        <p className={styles.subtitle}>
          Encuentra la propiedad de tus sueños
        </p>
      </div>

      <PropertyFilters onFilterChange={handleFilterChange} />

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando propiedades...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <i className="bi bi-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && properties && properties.length === 0 && (
        <div className={styles.empty}>
          <i className="bi bi-inbox"></i>
          <h3>No se encontraron propiedades</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {!loading && !error && properties && properties.length > 0 && (
        <>
          <div className={styles.results}>
            <p>
              Mostrando <strong>{properties.length}</strong> de{' '}
              <strong>{meta?.totalCount}</strong> propiedades
            </p>
          </div>

          <div className={styles.grid}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination Component (US-019) */}
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesList;
