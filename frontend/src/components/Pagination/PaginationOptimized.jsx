import PropTypes from 'prop-types';
import { memo } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

/**
 * Pagination Component - Optimized with Reactstrap (US-019)
 *
 * Uses Bootstrap Pagination components via Reactstrap.
 * Wrapped with React.memo for performance.
 *
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback function when page changes
 */
const PaginationOptimized = memo(({ currentPage, totalPages, onPageChange }) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav aria-label="Paginación de propiedades" className="d-flex justify-content-center mt-4">
      <div
        className="bg-white p-3 rounded shadow-sm"
        style={{ borderRadius: '12px' }}
      >
        <Pagination className="mb-0">
          {/* First Page */}
          <PaginationItem disabled={isFirstPage}>
            <PaginationLink
              first
              onClick={() => handlePageChange(1)}
              aria-label="Primera página"
              title="Primera página"
              className="border-2"
            >
              <i className="bi bi-chevron-double-left"></i>
            </PaginationLink>
          </PaginationItem>

          {/* Previous Page */}
          <PaginationItem disabled={isFirstPage}>
            <PaginationLink
              previous
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Página anterior"
              title="Página anterior"
              className="border-2"
            >
              <i className="bi bi-chevron-left"></i>
            </PaginationLink>
          </PaginationItem>

          {/* Page Info */}
          <PaginationItem disabled className="px-3">
            <PaginationLink
              style={{
                fontFamily: 'var(--font-descriptors)',
                fontSize: '0.9375rem',
                fontWeight: '400',
                lineHeight: '2',
                border: 'none',
                cursor: 'default'
              }}
            >
              Página <strong style={{ fontFamily: 'var(--font-heading)' }}>{currentPage}</strong> de{' '}
              <strong style={{ fontFamily: 'var(--font-heading)' }}>{totalPages}</strong>
            </PaginationLink>
          </PaginationItem>

          {/* Next Page */}
          <PaginationItem disabled={isLastPage}>
            <PaginationLink
              next
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Página siguiente"
              title="Página siguiente"
              className="border-2"
            >
              <i className="bi bi-chevron-right"></i>
            </PaginationLink>
          </PaginationItem>

          {/* Last Page */}
          <PaginationItem disabled={isLastPage}>
            <PaginationLink
              last
              onClick={() => handlePageChange(totalPages)}
              aria-label="Última página"
              title="Última página"
              className="border-2"
            >
              <i className="bi bi-chevron-double-right"></i>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    </nav>
  );
});

PaginationOptimized.displayName = 'PaginationOptimized';

PaginationOptimized.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationOptimized;
