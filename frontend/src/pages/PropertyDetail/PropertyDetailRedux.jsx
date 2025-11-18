import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyByIdThunk } from '../../store/properties/propertiesThunks';
import {
  selectSelectedProperty,
  selectSelectedLoading,
  selectSelectedError,
  clearSelectedProperty,
} from '../../store/properties/propertiesSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './PropertyDetail.module.css';

/**
 * PropertyDetail Page Component with Redux (US-021)
 *
 * Displays complete details of a single property using Redux state.
 *
 * Features:
 * - Redux state management
 * - Thunk-based API call
 * - Property ID extracted from URL params
 * - Large hero image
 * - Complete property information (name, address, price, owner)
 * - Back to list navigation
 * - Loading state with spinner
 * - Error/404 state handling
 * - Responsive design
 * - Million Luxury premium styling
 *
 * User Stories:
 * - US-021: Display property detail page
 *
 * @example
 * // Route: /properties/:id
 * // URL: /properties/507f1f77bcf86cd799439011
 */
const PropertyDetailRedux = () => {
  const { id } = useParams(); // Extract property ID from URL
  const navigate = useNavigate(); // React Router navigation
  const dispatch = useDispatch();

  // Redux selectors
  const property = useSelector(selectSelectedProperty);
  const loading = useSelector(selectSelectedLoading);
  const error = useSelector(selectSelectedError);

  /**
   * Fetch property when component mounts or ID changes
   * Clear property when component unmounts
   */
  useEffect(() => {
    dispatch(fetchPropertyByIdThunk(id));

    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [dispatch, id]);

  // Loading State - Show spinner while fetching data
  if (loading) {
    return (
      <div className="container">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  // Error/404 State - Show when property doesn't exist
  if (error || !property) {
    return (
      <div className="container">
        <div className={styles.error}>
          <i className="bi bi-exclamation-triangle"></i>
          <h2>Propiedad no encontrada</h2>
          <p>{error || 'La propiedad que buscas no existe o fue eliminada.'}</p>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            <i className="bi bi-arrow-left"></i>
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  // Success State - Display property details
  return (
    <div className="container">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className={styles.backButtonTop}
        aria-label="Volver al listado de propiedades"
      >
        <i className="bi bi-arrow-left"></i>
        Volver
      </button>

      {/* Property Detail Card */}
      <div className={styles.detail}>
        {/* Hero Image */}
        <div className={styles.imageContainer}>
          <img
            src={property.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
            alt={property.name}
            className={styles.image}
            loading="lazy"
          />
        </div>

        {/* Property Information */}
        <div className={styles.content}>
          {/* Property Name */}
          <h1 className={styles.name}>{property.name}</h1>

          {/* Property Price */}
          <div className={styles.price}>
            {formatCurrency(property.price)}
          </div>

          {/* Property Details */}
          <div className={styles.info}>
            {/* Address */}
            <div className={styles.infoItem}>
              <i className="bi bi-geo-alt"></i>
              <div>
                <strong>Dirección</strong>
                <p>{property.address}</p>
              </div>
            </div>

            {/* Owner */}
            <div className={styles.infoItem}>
              <i className="bi bi-person"></i>
              <div>
                <strong>Propietario</strong>
                <p>{property.idOwner}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailRedux;
