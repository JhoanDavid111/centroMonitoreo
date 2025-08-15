import styled from 'styled-components';

export const ProgressCard = styled.div`
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border-left: 4px solid
    ${({ theme, hasDelay }) => 
      hasDelay ? theme.colors.error[500] : theme.colors.success[500]};
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const ProgressTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

export const ProgressStatus = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.error[500]};
`;

export const ProgressBarContainer = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.colors.gray[700]};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background-color: ${({ theme, hasDelay }) => 
    hasDelay ? theme.colors.error[500] : theme.colors.primary[500]};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
`;

export const ProgressPercentage = styled.span`
  color: ${({ theme }) => theme.colors.gray[300]};
`;

export const ProgressUpdated = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
`;