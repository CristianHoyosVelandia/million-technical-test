import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner, Alert } from 'reactstrap';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import {
  fetchPropertiesThunk,
} from '../../store/properties/propertiesThunks';
import {
  selectProperties,
  selectPropertiesMeta,
  selectPropertiesLoading,
  selectPropertiesError,
  selectFilters,
  setFilters,
  setPage,
} from '../../store/properties/propertiesSlice';
import PropertyCardOptimized from '../../components/PropertyCard/PropertyCardOptimized';
import PropertyFiltersOptimized from './PropertyFiltersOptimized';
import PaginationOptimized from '../../components/Pagination/PaginationOptimized';

/**
 * PropertiesList Page Component with Redux (US-020)
 *
 * Main page for displaying paginated property listings with filters.
 * Uses Redux for state management and thunks for API calls.
 *
 * Features:
 * - Redux state management
 * - Thunk-based API calls
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
const PropertiesListRedux = () => {
  const dispatch = useDispatch();
  const { scrollToTop } = useSmoothScroll();

  // Redux selectors
  const properties = useSelector(selectProperties);
  const meta = useSelector(selectPropertiesMeta);
  const loading = useSelector(selectPropertiesLoading);
  const error = useSelector(selectPropertiesError);
  const filters = useSelector(selectFilters);

  /**
   * Fetches properties from API using Redux thunk
   * Triggered when filters change
   */
  useEffect(() => {
    // Build params from filters
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.address) params.address = filters.address;
    if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
    params.page = filters.page;
    params.pageSize = filters.pageSize;

    dispatch(fetchPropertiesThunk(params));
  }, [dispatch, filters]);

  /**
   * Handles filter changes from PropertyFilters component
   * Dispatches setFilters action (automatically resets to page 1)
   */
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  /**
   * Handles page navigation from Pagination component (US-019)
   * Scrolls to top for better UX with optimized smooth scroll
   */
  const handlePageChange = useCallback((newPage) => {
    dispatch(setPage(newPage));
    // Optimized smooth scroll to top
    scrollToTop(250); // 250ms duration for faster response
  }, [dispatch, scrollToTop]);

  return (
    <Container>
      {/* Header */}
      <div className="text-center mb-5">
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3.3125rem',
            fontWeight: '400',
            letterSpacing: '0.02em',
            lineHeight: '1.132',
            color: 'var(--text-primary)',
            margin: '0 0 0.5rem 0'
          }}
        >
          Propiedades Disponibles
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-descriptors)',
            fontSize: '1.1rem',
            fontWeight: '400',
            lineHeight: '2',
            color: 'var(--text-secondary)',
            margin: '0'
          }}
        >
          Encuentra la propiedad de tus sueños
        </p>
      </div>

      <PropertyFiltersOptimized onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          <p
            className="mt-3"
            style={{
              fontFamily: 'var(--font-descriptors)',
              fontSize: '0.9375rem',
              fontWeight: '400',
              lineHeight: '2'
            }}
          >
            Cargando propiedades...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert color="warning" className="text-center">
          <i className="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
          <p className="mb-0">{error}</p>
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && properties && properties.length === 0 && (
        <div className="text-center p-5 bg-white rounded shadow-sm">
          <i className="bi bi-inbox fs-1 text-secondary d-block mb-3"></i>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: '400',
              letterSpacing: '0.02em'
            }}
          >
            No se encontraron propiedades
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-descriptors)',
              fontSize: '0.9375rem',
              fontWeight: '400',
              lineHeight: '2',
              margin: '0'
            }}
          >
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}

      {/* Success State - Property List */}
      {!loading && !error && properties && properties.length > 0 && (
        <>
          {/* Results Counter */}
          <div className="mb-3">
            <p
              style={{
                fontFamily: 'var(--font-descriptors)',
                fontSize: '0.9375rem',
                fontWeight: '400',
                lineHeight: '2',
                color: 'var(--text-secondary)'
              }}
            >
              Mostrando <strong>{properties.length}</strong> de{' '}
              <strong>{meta?.totalCount}</strong> propiedades
            </p>
          </div>

          {/* Properties Grid */}
          <Row className="g-4 mb-4">
            {properties.map((property) => (
              <Col key={property.id} xs={12} md={6} lg={4}>
                <PropertyCardOptimized property={property} />
              </Col>
            ))}
          </Row>

          {/* Pagination Component (US-019) */}
          {meta && meta.totalPages > 1 && (
            <PaginationOptimized
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default PropertiesListRedux;
