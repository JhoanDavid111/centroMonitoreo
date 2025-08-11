import styled from 'styled-components';

export const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const ChartHeader = styled.div`
  margin-bottom: 1rem;
`;

export const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;