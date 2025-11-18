import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import styles from './PropertyFilters.module.css';

/**
 * PropertyFilters Component (US-018)
 *
 * Provides search and filter controls for the property list.
 *
 * Features:
 * - Text search by property name (debounced)
 * - Text search by address (debounced)
 * - Numeric filter by minimum price
 * - Numeric filter by maximum price
 * - Clear all filters button
 * - Debounce on text inputs (500ms) to prevent excessive API calls (US-016)
 * - Responsive grid layout
 * - Accessibility support (labels, ARIA)
 * - Million Luxury styling
 *
 * User Stories:
 * - US-018: Implement property filters component
 * - US-016: Use debounce hook for text inputs
 *
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback function called when filters change
 *
 * @example
 * <PropertyFilters
 *   onFilterChange={(filters) => console.log('Filters:', filters)}
 * />
 */
const PropertyFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    minPrice: '',
    maxPrice: '',
  });

  // Apply debounce only to text fields to prevent excessive API calls (US-016)
  const debouncedName = useDebounce(filters.name, 500);
  const debouncedAddress = useDebounce(filters.address, 500);

  /**
   * Notify parent component when debounced values change
   * Price filters trigger immediately (no debounce)
   */
  useEffect(() => {
    onFilterChange({
      name: debouncedName,
      address: debouncedAddress,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }, [debouncedName, debouncedAddress, filters.minPrice, filters.maxPrice, onFilterChange]);

  /**
   * Handles input field changes
   * Updates local state immediately, but API calls are debounced
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Clears all filter values and resets search
   */
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
        {/* Name Filter */}
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
            aria-label="Filtrar por nombre de propiedad"
          />
        </div>

        {/* Address Filter */}
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
            aria-label="Filtrar por dirección"
          />
        </div>

        {/* Minimum Price Filter */}
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
            aria-label="Filtrar por precio mínimo"
          />
        </div>

        {/* Maximum Price Filter */}
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
            aria-label="Filtrar por precio máximo"
          />
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={handleClearFilters}
          className={styles.clearButton}
          type="button"
          aria-label="Limpiar todos los filtros"
        >
          <i className="bi bi-x-circle"></i>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

PropertyFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default PropertyFilters;
