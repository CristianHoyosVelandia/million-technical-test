import { useState, useEffect, useCallback } from 'react';
import { getProperties } from '../../api/propertiesApi';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PropertyFilters from './PropertyFilters';
import styles from './PropertiesList.module.css';

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

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Filtrar parámetros vacíos
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

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset a la primera página cuando cambian filtros
    }));
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

          {/* TODO: Agregar componente de paginación (US-019) */}
        </>
      )}
    </div>
  );
};

export default PropertiesList;
