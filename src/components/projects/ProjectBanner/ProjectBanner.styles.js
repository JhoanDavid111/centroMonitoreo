import styled from 'styled-components';

export const BannerContainer = styled.div`
  position: relative;
  height: 200px;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    height: 250px;
  }
`;

export const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.4) 60%,
    transparent 100%
  );
`;

export const BannerContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 70%;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ status, theme }) => 
    status === 'green' ? '#10B981' :
    status === 'blue' ? '#3B82F6' :
    status === 'red' ? '#EF4444' :
    status === 'yellow' ? '#F59E0B' :
    '#6B7280'};
  color: white;
`;

export const IconWrapper = styled.div`
  img {
    width: 60px;
    height: 60px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    
    @media (min-width: 768px) {
      width: 80px;
      height: 80px;
    }
  }
`;