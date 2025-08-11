import styled from 'styled-components';

export const ListContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[700]};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[700]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const DocumentIcon = styled.div`
  margin-right: 1rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

export const DocumentInfo = styled.div`
  flex: 1;
`;

export const DocumentName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 0.25rem;
`;

export const DocumentMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

export const DownloadButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.gray[600]};
  }
`;