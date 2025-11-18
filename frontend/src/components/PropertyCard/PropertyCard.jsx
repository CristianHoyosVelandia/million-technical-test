import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './PropertyCard.module.css';

/**
 * Tarjeta de propiedad - muestra info básica de una propiedad
 * @param {Object} property - Datos de la propiedad
 */
const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={property.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={property.name}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{property.name}</h3>

        <p className={styles.address}>
          <i className="bi bi-geo-alt"></i>
          {property.address}
        </p>

        <div className={styles.footer}>
          <p className={styles.price}>
            {formatCurrency(property.price)}
          </p>
          <button className={styles.viewButton}>
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
