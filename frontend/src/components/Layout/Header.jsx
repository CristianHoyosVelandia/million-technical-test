import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          <Link to="/" className={styles.logo}>
            {/* <img src="/favicon.svg" alt="Million Luxury Logo" height={30}/> */}
            <span> Million</span>
          </Link>

          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>
              Portal de Propiedades
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
