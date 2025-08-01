// src/components/milestones/MilestoneCard/MilestoneCard.styles.js
import styled from 'styled-components';

export const CardContainer = styled.div`
 
  padding: 1rem;
  border-radius: 0.5rem;
`;

export const CardTitle = styled.h3`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.yellow400};
  margin: 0;
`;

export const CardDate = styled.p`
  font-size: 1.25rem;
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.colors.white};
`;

export const UpdateNote = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray400};
  font-style: italic;
  margin: 0;
`;