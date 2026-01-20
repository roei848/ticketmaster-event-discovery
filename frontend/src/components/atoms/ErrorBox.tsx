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
  background: rgba(211, 47, 47, 0.08);
  border: 1px solid rgba(211, 47, 47, 0.25);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.error};
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
