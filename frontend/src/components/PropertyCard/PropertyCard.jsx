import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './PropertyCard.module.css';

/**
 * PropertyCard Component (US-017)
 */
const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/properties/${property.id}`);

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { handleClick()}
      }}
      aria-label={`Ver detalles de ${property.name}`}
    >
      {/* Property Image */}
      <div className={styles.imageContainer}>
        <img
          src={property.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={property.name}
          className={styles.image}
          loading="lazy"
        />
      </div>

      {/* Property Information */}
      <div className={styles.content}>
        {/* Property Name */}
        <h3 className={styles.name}>{property.name}</h3>
        {/* Property Address */}
        <p className={styles.address}>
          <i className="bi bi-geo-alt"></i>
          {property.address}
        </p>
        {/* Precio y btn */}
        <div className={styles.footer}>
          <p className={styles.price}>
            {formatCurrency(property.price)}
          </p>
          <button
            className={styles.viewButton}
            onClick={handleClick}
            aria-label={`Ver detalles de ${property.name}`}
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default PropertyCard;
