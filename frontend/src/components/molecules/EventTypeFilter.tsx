import React from 'react';
import styled from 'styled-components';
import { Label } from '../atoms/Label';
import { Checkbox } from '../atoms/Checkbox';

interface EventTypeFilterProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const eventTypes = [
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
  { value: 'arts', label: 'Arts & Theatre' },
  { value: 'family', label: 'Family' }
];

export const EventTypeFilter: React.FC<EventTypeFilterProps> = ({ selectedTypes, onChange }) => {
  const handleToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <Container>
      <Label>Event Types</Label>
      <CheckboxGroup>
        {eventTypes.map(({ value, label }) => (
          <Checkbox
            key={value}
            label={label}
            checked={selectedTypes.includes(value)}
            onChange={() => handleToggle(value)}
          />
        ))}
      </CheckboxGroup>
    </Container>
  );
};
