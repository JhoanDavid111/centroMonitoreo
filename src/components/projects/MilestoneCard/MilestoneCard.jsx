// src/components/milestones/MilestoneCard/MilestoneCard.jsx
import PropTypes from 'prop-types';
import {
  CardContainer,
  CardTitle,
  CardDate,
  UpdateNote
} from './MilestoneCard.styles';

const MilestoneCard = ({ 
  title, 
  date, 
  updated, 
  hasNote= false
}) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardDate>{date}</CardDate>
      {hasNote && <UpdateNote>Actualizado: {updated}</UpdateNote>}
    </CardContainer>
  );
};

MilestoneCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  updated: PropTypes.string,
  hasNote: PropTypes.bool
};



export default MilestoneCard;