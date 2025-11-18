import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className={styles.notFound}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Página no encontrada</h2>
        <p className={styles.text}>
          La página que buscas no existe o fue movida.
        </p>
        <button onClick={() => navigate('/')} className={styles.button}>
          <i className="bi bi-house-door"></i> Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;
