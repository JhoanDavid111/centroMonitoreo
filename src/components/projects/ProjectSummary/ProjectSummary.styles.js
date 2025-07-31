import styled from 'styled-components';

export const SummaryContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: ${({ theme, variant }) => 
    variant === 'highlight' 
      ? theme.colors.primary[100] 
      : theme.colors.gray[800]};
  border: ${({ variant }) => 
    variant === 'warning' ? '1px solid #F59E0B' : 'none'};
`;

export const SummaryIcon = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
`;

export const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SummaryValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
`;

export const SummaryLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;