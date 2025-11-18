import { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import styles from './PropertyFilters.module.css';

/**
 * Componente de filtros para búsqueda de propiedades
 * Aplica debounce a inputs de texto para evitar requests excesivos
 */
const PropertyFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    minPrice: '',
    maxPrice: '',
  });

  // Aplicar debounce solo a los campos de texto
  const debouncedName = useDebounce(filters.name, 500);
  const debouncedAddress = useDebounce(filters.address, 500);

  // Cuando los valores con debounce cambian, notificar al padre
  useEffect(() => {
    onFilterChange({
      name: debouncedName,
      address: debouncedAddress,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }, [debouncedName, debouncedAddress, filters.minPrice, filters.maxPrice, onFilterChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      address: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label htmlFor="name" className={styles.label}>
            <i className="bi bi-search"></i>
            Nombre de la propiedad
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleInputChange}
            placeholder="Buscar por nombre..."
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="address" className={styles.label}>
            <i className="bi bi-geo-alt"></i>
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={filters.address}
            onChange={handleInputChange}
            placeholder="Buscar por dirección..."
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="minPrice" className={styles.label}>
            <i className="bi bi-currency-dollar"></i>
            Precio mínimo
          </label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="0"
            className={styles.input}
            min="0"
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="maxPrice" className={styles.label}>
            <i className="bi bi-currency-dollar"></i>
            Precio máximo
          </label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="Sin límite"
            className={styles.input}
            min="0"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleClearFilters}
          className={styles.clearButton}
          type="button"
        >
          <i className="bi bi-x-circle"></i>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;
