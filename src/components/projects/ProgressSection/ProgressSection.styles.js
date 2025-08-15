import styled from 'styled-components';

export const SectionContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yellow[400]};
  margin-bottom: 1rem;
`;

export const ProgressItem = styled.div`
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const ProgressLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

export const ProgressBarWrapper = styled.div`
  width: 100%;
`;

export const ProgressBar = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.colors.gray[700]};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background-color: ${({ theme, variant }) => 
    variant === 'primary' 
      ? theme.colors.primary[500] 
      : variant === 'warning' 
        ? theme.colors.yellow[500] 
        : theme.colors.gray[500]};
  transition: width 0.3s ease;
`;

export const ProgressPercentage = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;