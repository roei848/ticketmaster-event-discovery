import React from 'react';
import styled from 'styled-components';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  $customStyles?: string;
}

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const StyledCheckbox = styled.input<CheckboxProps>`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${props => props.$customStyles}
`;

const CheckboxLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  user-select: none;

  &:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  if (label) {
    return (
      <CheckboxContainer>
        <StyledCheckbox type="checkbox" id={checkboxId} {...props} />
        <CheckboxLabel htmlFor={checkboxId}>{label}</CheckboxLabel>
      </CheckboxContainer>
    );
  }

  return <StyledCheckbox type="checkbox" {...props} />;
};
