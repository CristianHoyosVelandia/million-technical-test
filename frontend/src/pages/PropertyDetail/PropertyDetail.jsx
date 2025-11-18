import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../../api/propertiesApi';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './PropertyDetail.module.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPropertyById(id);
      setProperty(data);
    } catch (err) {
      setError('Propiedad no encontrada');
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !property) {
    return (
      <div className="container">
        <div className={styles.error}>
          <i className="bi bi-exclamation-triangle"></i>
          <h2>Propiedad no encontrada</h2>
          <p>La propiedad que buscas no existe o fue eliminada.</p>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            <i className="bi bi-arrow-left"></i>
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className={styles.backButtonTop}>
        <i className="bi bi-arrow-left"></i>
        Volver
      </button>

      <div className={styles.detail}>
        <div className={styles.imageContainer}>
          <img
            src={property.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
            alt={property.name}
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <h1 className={styles.name}>{property.name}</h1>

          <div className={styles.price}>
            {formatCurrency(property.price)}
          </div>

          <div className={styles.info}>
            <div className={styles.infoItem}>
              <i className="bi bi-geo-alt"></i>
              <div>
                <strong>Dirección</strong>
                <p>{property.address}</p>
              </div>
            </div>

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

export default PropertyDetail;
