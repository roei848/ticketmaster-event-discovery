import React from 'react';
import styled from 'styled-components';
import { AlertCircle } from 'lucide-react';

interface ErrorBoxProps {
  message: string;
}

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.lg} 0;
  background: ${props => props.theme.mode === 'dark'
    ? 'rgba(239, 68, 68, 0.1)'
    : 'rgba(239, 68, 68, 0.05)'};
  border: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(239, 68, 68, 0.2)'};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.mode === 'dark'
    ? '#fca5a5'
    : '#dc2626'};
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const ErrorBox: React.FC<ErrorBoxProps> = ({ message }) => {
  return (
    <ErrorContainer>
      <IconWrapper>
        <AlertCircle size={24} />
      </IconWrapper>
      <ErrorMessage>{message}</ErrorMessage>
    </ErrorContainer>
  );
};
