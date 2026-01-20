import React from 'react';
import styled from 'styled-components';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  $customStyles?: string;
}

const StyledSelect = styled.select<SelectProps>`
  width: 100%;
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-family: inherit;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.borderHover};
  }

  &:focus-visible {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${props => props.theme.colors.surface};
  }

  ${props => props.$customStyles}
`;

export const Select: React.FC<SelectProps> = (props) => {
  return <StyledSelect {...props} />;
};
