import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size?: number;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
`;

const SpinnerCircle = styled.div<{ $size: number }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

export const Spinner: React.FC<SpinnerProps> = ({ size = 40 }) => {
  return (
    <SpinnerContainer>
      <div>
        <SpinnerCircle $size={size} />
        <LoadingText>Searching for events...</LoadingText>
      </div>
    </SpinnerContainer>
  );
};
