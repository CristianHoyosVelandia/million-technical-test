import PropTypes from 'prop-types';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardImg, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { formatCurrency } from '../../utils/formatCurrency';

const PropertyCardOptimized = memo(({ property }) => {
  const navigate = useNavigate();
  const handleClick = () =>navigate(`/properties/${property.id}`);

  return (
    <Card className="h-100 shadow-sm property-card property-card-hover rounded-0" onClick={handleClick} role="button" >
      <div className="overflow-hidden position-relative" style={{ height: '280px' }}>
        <CardImg
          top
          src={property.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={property.name}
          loading="lazy"
          className="w-100 h-100 object-fit-cover property-card-img"
          style={{ transition: 'transform .5s ease' }}
        />
      </div>

      <CardBody className="d-flex flex-column bg-light">
        <CardTitle
          tag="h3"
          className="mb-3 text-capitalize fw-normal fs-4 text-dark overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {property.name}
        </CardTitle>

        <CardText
          className="mb-3 small text-secondary overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          <i className="bi bi-geo-alt me-2"></i>
          {property.address}
        </CardText>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <p className="mb-0 fw-semibold fs-5 text-dark">
            {formatCurrency(property.price)}
          </p>

          <Button
            color="dark"
            outline
            size="sm"
            className="text-uppercase rounded-0 px-3 py-2 fw-medium"
            onClick={handleClick}
          >
            Ver detalles
          </Button>
        </div>
      </CardBody>
    </Card>
  );
});

PropertyCardOptimized.displayName = 'PropertyCardOptimized';

PropertyCardOptimized.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string
  }).isRequired
};

export default PropertyCardOptimized;
