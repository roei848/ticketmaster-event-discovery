import React from 'react';
import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleSwitchProps {
  isDark: boolean;
  onToggle: () => void;
}

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledSelect = styled.select<{ $isDark: boolean }>`
  appearance: none;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xl} ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  padding-left: 40px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  min-width: 130px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const ChevronWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

export const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({ isDark, onToggle }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIsDark = e.target.value === 'dark';
    if (newIsDark !== isDark) {
      onToggle();
    }
  };

  return (
    <DropdownContainer>
      <IconWrapper>
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </IconWrapper>
      <StyledSelect value={isDark ? 'dark' : 'light'} onChange={handleChange} $isDark={isDark}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </StyledSelect>
      <ChevronWrapper>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </ChevronWrapper>
    </DropdownContainer>
  );
};
