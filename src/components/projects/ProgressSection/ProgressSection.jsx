// src/components/projects/ProgressSection/ProgressSection.jsx
import PropTypes from 'prop-types';
import {
  SectionContainer,
  SectionTitle,
  ProgressItem,
  ProgressHeader,
  ProgressLabel,
  ProgressBarWrapper,
  ProgressBar,
  ProgressFill,
  ProgressPercentage
} from './ProgressSection.styles';

const ProgressSection = ({ title, items }) => {
  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      {items.map((item, index) => (
        <ProgressItem key={index}>
          <ProgressHeader>
            <ProgressLabel>{item.label}</ProgressLabel>
            <ProgressPercentage>{item.percentage}%</ProgressPercentage>
          </ProgressHeader>
          <ProgressBarWrapper>
            <ProgressBar>
              <ProgressFill 
                percentage={item.percentage} 
                variant={item.variant}
              />
            </ProgressBar>
          </ProgressBarWrapper>
        </ProgressItem>
      ))}
    </SectionContainer>
  );
};

ProgressSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      percentage: PropTypes.number.isRequired,
      variant: PropTypes.oneOf(['primary', 'secondary', 'warning'])
    })
  ).isRequired
};

ProgressSection.defaultProps = {
  items: []
};

export default ProgressSection;