import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, CardImg, CardBody, Button, Spinner, Alert } from 'reactstrap';
import { fetchPropertyByIdThunk } from '../../store/properties/propertiesThunks';
import {
  selectSelectedProperty,
  selectSelectedLoading,
  selectSelectedError,
  clearSelectedProperty,
} from '../../store/properties/propertiesSlice';
import { formatCurrency } from '../../utils/formatCurrency';

/**
 * PropertyDetail Page Component - Optimized with Reactstrap (US-021)
 *
 * Uses Bootstrap components via Reactstrap for better performance.
 * Displays complete details of a single property using Redux state.
 *
 * @example
 * // Route: /properties/:id
 * // URL: /properties/507f1f77bcf86cd799439011
 */
const PropertyDetailOptimized = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const property = useSelector(selectSelectedProperty);
  const loading = useSelector(selectSelectedLoading);
  const error = useSelector(selectSelectedError);

  useEffect(() => {
    dispatch(fetchPropertyByIdThunk(id));
    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [dispatch, id]);

  // Loading State
  if (loading) {
    return (
      <Container>
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
            Cargando propiedad...
          </p>
        </div>
      </Container>
    );
  }

  // Error/404 State
  if (error || !property) {
    return (
      <Container>
        <div className="text-center p-5 bg-white rounded shadow-sm">
          <i className="bi bi-exclamation-triangle text-danger fs-1 d-block mb-3"></i>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: '400',
              letterSpacing: '0.02em',
              color: 'var(--text-primary)'
            }}
          >
            Propiedad no encontrada
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-descriptors)',
              fontSize: '0.9375rem',
              fontWeight: '400',
              lineHeight: '2',
              color: 'var(--text-secondary)'
            }}
          >
            {error || 'La propiedad que buscas no existe o fue eliminada.'}
          </p>
          <Button
            color="primary"
            onClick={() => navigate('/')}
            className="mt-3 d-inline-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i>
            Volver al listado
          </Button>
        </div>
      </Container>
    );
  }

  // Success State
  return (
    <Container>
      {/* Back Button */}
      <Button
        color="light"
        outline
        onClick={() => navigate('/')}
        className="mb-4 d-inline-flex align-items-center gap-2"
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: '500'
        }}
      >
        <i className="bi bi-arrow-left"></i>
        Volver
      </Button>

      {/* Property Detail Card */}
      <Card className="shadow">
        {/* Hero Image */}
        <div style={{ height: '500px', overflow: 'hidden' }}>
          <CardImg
            top
            src={property.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
            alt={property.name}
            loading="lazy"
            style={{
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        <CardBody className="p-4">
          {/* Property Name */}
          <h1
            className="mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: '400',
              letterSpacing: '0.02em',
              lineHeight: '1.132',
              color: 'var(--text-primary)'
            }}
          >
            {property.name}
          </h1>

          {/* Property Price */}
          <div
            className="mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.75rem',
              fontWeight: '600',
              letterSpacing: '0.01em',
              color: '#1a1a1a'
            }}
          >
            {formatCurrency(property.price)}
          </div>

          {/* Property Details */}
          <div className="d-flex flex-column gap-4">
            {/* Address */}
            <div className="d-flex align-items-start gap-3">
              <i className="bi bi-geo-alt text-primary fs-4 mt-1"></i>
              <div>
                <strong
                  className="d-block mb-1"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    letterSpacing: '0.02em',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Dirección
                </strong>
                <p
                  className="mb-0"
                  style={{
                    fontFamily: 'var(--font-descriptors)',
                    fontSize: '0.9375rem',
                    fontWeight: '400',
                    lineHeight: '2',
                    color: 'var(--text-primary)'
                  }}
                >
                  {property.address}
                </p>
              </div>
            </div>

            {/* Owner */}
            <div className="d-flex align-items-start gap-3">
              <i className="bi bi-person text-primary fs-4 mt-1"></i>
              <div>
                <strong
                  className="d-block mb-1"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    letterSpacing: '0.02em',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Propietario
                </strong>
                <p
                  className="mb-0"
                  style={{
                    fontFamily: 'var(--font-descriptors)',
                    fontSize: '0.9375rem',
                    fontWeight: '400',
                    lineHeight: '2',
                    color: 'var(--text-primary)'
                  }}
                >
                  {property.idOwner}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default PropertyDetailOptimized;
