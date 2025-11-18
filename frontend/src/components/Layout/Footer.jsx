import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <p className={styles.text}>
            © {currentYear} Million Luxury. Todos los derechos reservados.
          </p>
          <p className={styles.author}>
            Desarrollado por <strong>Cristian Hoyos</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
