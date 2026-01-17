import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  $customStyles?: string;
}

const StyledInput = styled.input<InputProps>`
  width: 100%;
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-family: inherit;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.borderHover};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => {
      const color = props.hasError ? props.theme.colors.error : props.theme.colors.primary;
      return `${color}20`; // 20 is hex for ~12% opacity
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${props => props.theme.colors.surface};
  }

  ${props => props.$customStyles}
`;

/**
 * Input component with theme support and error states
 * @param hasError - Whether the input has a validation error
 * @param $customStyles - Custom CSS styles to apply
 */
export const Input: React.FC<InputProps> = (props) => {
  return <StyledInput {...props} />;
};
