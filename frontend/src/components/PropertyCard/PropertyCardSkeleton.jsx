import { Card, CardBody } from 'reactstrap';

/**
 * PropertyCardSkeleton Component
 *
 * Skeleton loader para PropertyCard que previene layout shift
 * durante la carga de datos. Simula la estructura exacta de PropertyCard.
 *
 * Características:
 * - Mismas dimensiones que PropertyCard
 * - Animación shimmer sutil
 * - Escala de grises para simular loading
 * - 3x3 grid layout (9 skeletons por defecto)
 */
const PropertyCardSkeleton = () => {
  return (
    <Card className="h-100 shadow-sm rounded-0" style={{ overflow: 'hidden' }}>
      {/* Image Skeleton - Mismo height que PropertyCard (280px) */}
      <div
        className="skeleton-shimmer"
        style={{
          height: '280px',
          backgroundColor: '#d0d0d0',
          position: 'relative'
        }}
      >
        {/* Icon simulando imagen */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            backgroundColor: '#b0b0b0',
            borderRadius: '8px'
          }}
        />
      </div>

      {/* Card Body Skeleton */}
      <CardBody className="d-flex flex-column bg-light">
        {/* Title Skeleton - 2 lines con diferentes tonos */}
        <div className="mb-3">
          <div
            className="skeleton-shimmer mb-2"
            style={{
              height: '24px',
              width: '90%',
              backgroundColor: '#c0c0c0',
              borderRadius: '4px'
            }}
          />
          <div
            className="skeleton-shimmer"
            style={{
              height: '24px',
              width: '70%',
              backgroundColor: '#c8c8c8',
              borderRadius: '4px'
            }}
          />
        </div>

        {/* Address Skeleton - 2 lines con tonos más claros */}
        <div className="mb-3">
          <div
            className="skeleton-shimmer mb-2"
            style={{
              height: '16px',
              width: '95%',
              backgroundColor: '#d8d8d8',
              borderRadius: '4px'
            }}
          />
          <div
            className="skeleton-shimmer"
            style={{
              height: '16px',
              width: '80%',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px'
            }}
          />
        </div>

        {/* Price and Button Skeleton */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          {/* Price Skeleton - Tono más oscuro para destacar */}
          <div
            className="skeleton-shimmer"
            style={{
              height: '24px',
              width: '120px',
              backgroundColor: '#a8a8a8',
              borderRadius: '4px'
            }}
          />

          {/* Button Skeleton - Tono intermedio */}
          <div
            className="skeleton-shimmer"
            style={{
              height: '36px',
              width: '110px',
              backgroundColor: '#b8b8b8',
              borderRadius: '4px',
              border: '1px solid #a0a0a0'
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default PropertyCardSkeleton;
