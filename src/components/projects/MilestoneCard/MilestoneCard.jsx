// src/components/milestones/MilestoneCard/MilestoneCard.jsx

import PropTypes from 'prop-types';
import {
  CardContainer,
  CardTitle,
  CardDate,
  UpdateNote,
  StatusIndicator,
  NoteBadge
} from './MilestoneCard.styles';
import { formatDate } from '../../../utils/dateUtils'; // Asegúrate de tener esta utilidad

const MilestoneCard = ({ 
  title, 
  date, 
  updated, 
  hasNote = false,
  status = 'on-track' // Valores posibles: 'on-track', 'delayed', 'at-risk'
}) => {
  return (
    <CardContainer status={status}>
      <div className="header">
        <CardTitle>{title}</CardTitle>
        <StatusIndicator status={status} />
      </div>
      
      <CardDate>
        <span className="label">Fecha:</span> 
        {formatDate(date) || 'No definida'}
      </CardDate>
      
      {updated && (
        <UpdateNote>
          <span className="label">Actualizado:</span> {formatDate(updated)}
        </UpdateNote>
      )}
      
      {hasNote && (
        <NoteBadge>
          <span className="note-icon">!</span>
          <span className="note-text">Nota importante</span>
        </NoteBadge>
      )}
    </CardContainer>
  );
};

MilestoneCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  updated: PropTypes.string,
  hasNote: PropTypes.bool,
  status: PropTypes.oneOf(['on-track', 'delayed', 'at-risk'])
};

export default MilestoneCard;