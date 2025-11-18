import PropTypes from 'prop-types';
import { useState, useEffect, memo, useCallback } from 'react';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import useDebounce from '../../hooks/useDebounce';

/**
 * PropertyFilters Component - Optimized with Reactstrap (US-018)
 *
 * Uses Bootstrap Form components via Reactstrap for better performance.
 * Wrapped with React.memo and useCallback for optimization.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback function called when filters change
 */
const PropertyFiltersOptimized = memo(({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    minPrice: '',
    maxPrice: '',
  });

  // Apply debounce only to text fields (US-016)
  const debouncedName = useDebounce(filters.name, 500);
  const debouncedAddress = useDebounce(filters.address, 500);

  // Notify parent when debounced values change
  useEffect(() => {
    onFilterChange({
      name: debouncedName,
      address: debouncedAddress,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }, [debouncedName, debouncedAddress, filters.minPrice, filters.maxPrice, onFilterChange]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      name: '',
      address: '',
      minPrice: '',
      maxPrice: '',
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-sm mb-4">
      <Row>
        {/* Name Filter */}
        <Col md={6} lg={3}>
          <FormGroup>
            <Label
              for="name"
              className="d-flex align-items-center gap-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: '500',
                letterSpacing: '0.02em',
                color: '#333'
              }}
            >
              <i className="bi bi-search" style={{ color: '#2c5f2d' }}></i>
              Nombre de la propiedad
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={filters.name}
              onChange={handleInputChange}
              placeholder="Buscar por nombre..."
              className="border-2"
              style={{
                fontFamily: 'var(--font-descriptors)',
                fontSize: '0.9375rem',
                fontWeight: '400'
              }}
            />
          </FormGroup>
        </Col>

        {/* Address Filter */}
        <Col md={6} lg={3}>
          <FormGroup>
            <Label
              for="address"
              className="d-flex align-items-center gap-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: '500',
                letterSpacing: '0.02em',
                color: '#333'
              }}
            >
              <i className="bi bi-geo-alt" style={{ color: '#2c5f2d' }}></i>
              Dirección
            </Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={filters.address}
              onChange={handleInputChange}
              placeholder="Buscar por dirección..."
              className="border-2"
              style={{
                fontFamily: 'var(--font-descriptors)',
                fontSize: '0.9375rem',
                fontWeight: '400'
              }}
            />
          </FormGroup>
        </Col>

        {/* Min Price Filter */}
        <Col md={6} lg={2}>
          <FormGroup>
            <Label
              for="minPrice"
              className="d-flex align-items-center gap-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: '500',
                letterSpacing: '0.02em',
                color: '#333'
              }}
            >
              <i className="bi bi-currency-dollar" style={{ color: '#2c5f2d' }}></i>
              Precio mínimo
            </Label>
            <Input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="border-2"
              style={{
                fontFamily: 'var(--font-descriptors)',
                fontSize: '0.9375rem',
                fontWeight: '400'
              }}
            />
          </FormGroup>
        </Col>

        {/* Max Price Filter */}
        <Col md={6} lg={2}>
          <FormGroup>
            <Label
              for="maxPrice"
              className="d-flex align-items-center gap-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                fontWeight: '500',
                letterSpacing: '0.02em',
                color: '#333'
              }}
            >
              <i className="bi bi-currency-dollar" style={{ color: '#2c5f2d' }}></i>
              Precio máximo
            </Label>
            <Input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="Sin límite"
              min="0"
              className="border-2"
              style={{
                fontFamily: 'var(--font-descriptors)',
                fontSize: '0.9375rem',
                fontWeight: '400'
              }}
            />
          </FormGroup>
        </Col>

        {/* Clear Button */}
        <Col md={12} lg={2} className="d-flex align-items-end">
          <FormGroup className="w-100">
            <Button
              color="dark"
              outline
              onClick={handleClearFilters}
              className="w-100 text-uppercase d-flex align-items-center justify-content-center gap-2"
              style={{
                fontFamily: 'var(--font-body)',
                borderRadius: '0',
                fontSize: '0.875rem',
                fontWeight: '500',
                letterSpacing: '0.05em',
                padding: '0.625rem 1.25rem',
                border: '2px solid #e0e0e0'
              }}
            >
              <i className="bi bi-x-circle"></i>
              Limpiar
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
});

PropertyFiltersOptimized.displayName = 'PropertyFiltersOptimized';

PropertyFiltersOptimized.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default PropertyFiltersOptimized;
