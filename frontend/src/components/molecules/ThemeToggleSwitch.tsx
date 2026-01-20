import React from 'react';
import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleSwitchProps {
  isDark: boolean;
  onToggle: () => void;
}

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ToggleTrack = styled.button<{ $isDark: boolean }>`
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: 16px;
  border: none;
  background: ${props => props.$isDark
    ? props.theme.colors.primary
    : props.theme.colors.border};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ToggleIndicator = styled.div<{ $isDark: boolean }>`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: transform ${props => props.theme.transitions.normal};
  transform: translateX(${props => props.$isDark ? '32px' : '0'});
  left: 4px;
`;

const IconWrapper = styled.div<{ $active: boolean }>`
  color: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: color ${props => props.theme.transitions.normal};
`;

export const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({ isDark, onToggle }) => {
  return (
    <ToggleContainer>
      <ToggleTrack onClick={onToggle} $isDark={isDark} aria-label="Toggle theme">
        <IconWrapper $active={!isDark}>
          <Sun size={16} />
        </IconWrapper>
        <IconWrapper $active={isDark}>
          <Moon size={16} />
        </IconWrapper>
        <ToggleIndicator $isDark={isDark} />
      </ToggleTrack>
    </ToggleContainer>
  );
};
