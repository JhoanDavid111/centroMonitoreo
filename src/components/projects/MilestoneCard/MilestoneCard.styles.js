// src/components/milestones/MilestoneCard/MilestoneCard.styles.js
import styled from 'styled-components';
import { colors } from '../../../../styles/theme';

export const CardContainer = styled.div`
  background: ${colors.gray700};
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  transition: all 0.3s ease;
  border-left: 4px solid ${
    props => props.status === 'delayed' ? colors.red500 : 
            props.status === 'at-risk' ? colors.yellow500 : 
            colors.green500
  };

  &:hover {
    background: ${colors.gray600};
    transform: translateY(-2px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .label {
    color: ${colors.gray400};
    margin-right: 0.5rem;
    font-size: 0.875rem;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.yellow400};
  margin: 0;
`;

export const CardDate = styled.p`
  color: ${colors.white};
  margin: 0.5rem 0;
  font-size: 1rem;
`;

export const UpdateNote = styled.p`
  color: ${colors.gray300};
  font-size: 0.875rem;
  margin: 0.25rem 0;
`;

export const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${
    props => props.status === 'delayed' ? colors.red500 : 
            props.status === 'at-risk' ? colors.yellow500 : 
            colors.green500
  };
`;

export const NoteBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: ${colors.yellow400};
  color: ${colors.gray900};
  border-radius: 9999px;
  padding: 0.25rem 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;

  .note-icon {
    margin-right: 0.25rem;
    font-weight: bold;
  }
`;