// src/components/projects/ProjectBanner/ProjectBanner.jsx
import PropTypes from 'prop-types';
import {
  BannerContainer,
  BannerImage,
  BannerOverlay,
  BannerContent,
  Title,
  Subtitle,
  StatusBadge,
  IconWrapper,
  ContentWrapper
} from './ProjectBanner.styles';

const ProjectBanner = ({ 
  title, 
  subtitle, 
  status, 
  image, 
  icon 
}) => {
  // Mapeo de estados a colores (personalizable según tu tema)
  const getStatusColor = (status) => {
    if (!status) return 'gray';
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('ejecución')) return 'green';
    if (statusLower.includes('diseño')) return 'blue';
    if (statusLower.includes('retraso') || statusLower.includes('atraso')) return 'red';
    return 'yellow';
  };

  return (
    <BannerContainer>
      <BannerImage src={image} alt={`Banner de ${title}`} />
      <BannerOverlay />
      
      <BannerContent>
        <ContentWrapper>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          {status && (
            <StatusBadge status={getStatusColor(status)}>
              {status}
            </StatusBadge>
          )}
        </ContentWrapper>
        
        {icon && (
          <IconWrapper>
            <img src={icon} alt="Icono del proyecto" />
          </IconWrapper>
        )}
      </BannerContent>
    </BannerContainer>
  );
};

ProjectBanner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  status: PropTypes.string,
  image: PropTypes.string.isRequired,
  icon: PropTypes.string
};

ProjectBanner.defaultProps = {
  subtitle: '',
  status: '',
  icon: null
};

export default ProjectBanner;