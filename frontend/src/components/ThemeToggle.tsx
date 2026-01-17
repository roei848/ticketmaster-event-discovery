import React from 'react';
import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';
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
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggle}
        icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
      >
        {isDark ? 'Light' : 'Dark'}
      </Button>
    </ToggleContainer>
  );
};
