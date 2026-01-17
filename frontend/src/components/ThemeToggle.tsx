import React from 'react';
import styled from 'styled-components';
import { Button } from './atoms/Button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ToggleContainer = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  z-index: ${props => props.theme.zIndex.tooltip};
`;

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <ToggleContainer>
      <Button variant="secondary" size="sm" onClick={onToggle}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </Button>
    </ToggleContainer>
  );
};
