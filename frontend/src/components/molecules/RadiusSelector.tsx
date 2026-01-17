import React from 'react';
import styled from 'styled-components';
import { Label } from '../atoms/Label';
import { Select } from '../atoms/Select';

interface RadiusSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  min-width: 150px;
`;

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({ value, onChange }) => {
  return (
    <Container>
      <Label>Radius (km)</Label>
      <Select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        <option value={5}>5 km</option>
        <option value={10}>10 km</option>
        <option value={25}>25 km</option>
        <option value={50}>50 km</option>
        <option value={100}>100 km</option>
      </Select>
    </Container>
  );
};
