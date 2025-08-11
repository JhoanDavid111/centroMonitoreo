import PropTypes from 'prop-types';
import { 
  ProgressCard,
  ProgressHeader,
  ProgressTitle,
  ProgressStatus,
  ProgressBarContainer,
  ProgressBarFill,
  ProgressMeta,
  ProgressPercentage,
  ProgressUpdated
} from './ProgressSummaryCard.styles';

const ProgressSummaryCard = ({ 
  title, 
  percentage, 
  hasDelay, 
  delayDays, 
  updated 
}) => {
  return (
    <ProgressCard hasDelay={hasDelay}>
      <ProgressHeader>
        <ProgressTitle>{title}</ProgressTitle>
        {hasDelay && (
          <ProgressStatus>
            Retraso: {delayDays} días
          </ProgressStatus>
        )}
      </ProgressHeader>
      
      <ProgressBarContainer>
        <ProgressBarFill 
          percentage={percentage} 
          hasDelay={hasDelay}
        />
      </ProgressBarContainer>
      
      <ProgressMeta>
        <ProgressPercentage>
          {percentage}% completado
        </ProgressPercentage>
        <ProgressUpdated>
          Actualizado: {updated}
        </ProgressUpdated>
      </ProgressMeta>
    </ProgressCard>
  );
};

ProgressSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  hasDelay: PropTypes.bool,
  delayDays: PropTypes.number,
  updated: PropTypes.string.isRequired,
};

ProgressSummaryCard.defaultProps = {
  hasDelay: false,
  delayDays: 0,
};

export default ProgressSummaryCard;