import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          <Link to="/" className={styles.logo}>
            <i className="bi bi-house-door"></i>
            <span>Million Luxury</span>
          </Link>

          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>
              Propiedades
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
