import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  $customStyles?: string;
}

const StyledButton = styled.button<ButtonProps>`
  background: ${props => props.variant === 'primary'
    ? props.theme.colors.primary
    : 'transparent'};
  color: ${props => props.variant === 'primary'
    ? '#fff'
    : props.theme.colors.text};
  padding: ${props => {
    const { spacing } = props.theme;
    return props.size === 'sm'
      ? `${spacing.sm} ${spacing.md}`
      : props.size === 'lg'
      ? `${spacing.md} ${spacing.xl}`
      : `${spacing.sm} ${spacing.lg}`;
  }};
  font-size: ${props => {
    const { typography } = props.theme;
    return props.size === 'sm'
      ? typography.fontSize.sm
      : props.size === 'lg'
      ? typography.fontSize.lg
      : typography.fontSize.md;
  }};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props => props.variant === 'primary'
    ? 'transparent'
    : props.theme.colors.border};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};

  &:hover:not(:disabled) {
    background: ${props => props.variant === 'primary'
      ? props.theme.colors.primaryHover
      : props.theme.colors.surface};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.$customStyles}
`;

/**
 * Button component with theme support
 * @param variant - Button style variant (primary or secondary)
 * @param size - Button size (sm, md, or lg)
 * @param $customStyles - Custom CSS styles to apply
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
};
