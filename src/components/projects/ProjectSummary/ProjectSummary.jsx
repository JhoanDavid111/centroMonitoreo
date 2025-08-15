import PropTypes from 'prop-types';
import { 
  SummaryContainer,
  SummaryIcon,
  SummaryContent,
  SummaryValue,
  SummaryLabel 
} from './ProjectSummary.styles';

const ProjectSummary = ({ value, label, icon, variant = 'default' }) => {
  return (
    <SummaryContainer variant={variant}>
      <SummaryIcon src={icon} alt={label} />
      <SummaryContent>
        <SummaryValue>{value}</SummaryValue>
        <SummaryLabel>{label}</SummaryLabel>
      </SummaryContent>
    </SummaryContainer>
  );
};

ProjectSummary.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['default', 'highlight', 'warning']),
};

export default ProjectSummary;