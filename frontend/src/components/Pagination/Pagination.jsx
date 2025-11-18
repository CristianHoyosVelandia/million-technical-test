import PropTypes from 'prop-types';
import styles from './Pagination.module.css';

/**
 * Pagination Component (US-019)
 *
 * Provides navigation controls for paginated data with accessibility support.
 *
 * Features:
 * - First, Previous, Next, Last page buttons
 * - Current page and total pages indicator
 * - Automatic button disabling when not applicable
 * - ARIA labels for screen readers
 * - Responsive design
 *
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback function when page changes
 *
 * @example
 * <Pagination
 *   currentPage={2}
 *   totalPages={10}
 *   onPageChange={(page) => console.log('Navigate to page:', page)}
 * />
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  /**
   * Handles page navigation with validation
   * @param {number} page - Target page number
   */
  const handlePageChange = (page) => {
    // Validate page number is within bounds
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className={styles.pagination}
      role="navigation"
      aria-label="Paginación de propiedades"
    >
      <div className={styles.controls}>
        {/* First Page Button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={isFirstPage}
          className={styles.button}
          aria-label="Primera página"
          title="Primera página"
        >
          <i className="bi bi-chevron-double-left"></i>
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={styles.button}
          aria-label="Página anterior"
          title="Página anterior"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        {/* Page Indicator */}
        <span className={styles.pageInfo} aria-live="polite">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>

        {/* Next Page Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          className={styles.button}
          aria-label="Página siguiente"
          title="Página siguiente"
        >
          <i className="bi bi-chevron-right"></i>
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={isLastPage}
          className={styles.button}
          aria-label="Última página"
          title="Última página"
        >
          <i className="bi bi-chevron-double-right"></i>
        </button>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
