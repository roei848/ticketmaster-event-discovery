import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { MapPin } from 'lucide-react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';

interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface CityAutocompleteProps {
  cities: City[];
  value: string;
  selectedCity: City | null;
  onCityChange: (value: string) => void;
  onCitySelect: (city: City) => void;
}

const Container = styled.div`
  position: relative;
  flex: 2;
  min-width: 250px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledInput = styled(Input)`
  padding-left: calc(${props => props.theme.spacing.md} * 2 + 20px);
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.sm};
  max-height: 240px;
  overflow-y: auto;
  z-index: ${props => props.theme.zIndex.dropdown};
  box-shadow: ${props => props.theme.shadows.lg};
  list-style: none;
  padding: 0;
`;

const SuggestionItem = styled.li`
  padding: ${props => `${props.theme.spacing.md} ${props.theme.spacing.lg}`};
  cursor: pointer;
  transition: background ${props => props.theme.transitions.fast};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: #fff;
  }
`;

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  cities,
  value,
  selectedCity: _selectedCity,
  onCityChange,
  onCitySelect
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = useMemo(() => {
    if (!value || value.length < 2) return [];
    return cities
      .filter(city => city.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 10);
  }, [cities, value]);

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setShowSuggestions(false);
  };

  return (
    <Container>
      <FieldContainer>
        <Label>City</Label>
        <InputWrapper>
          <IconWrapper>
            <MapPin size={20} />
          </IconWrapper>
          <StyledInput
            value={value}
            onChange={(e) => {
              onCityChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Enter city name..."
          />
        </InputWrapper>
      </FieldContainer>
      {showSuggestions && filteredCities.length > 0 && (
        <SuggestionsList>
          {filteredCities.map(city => (
            <SuggestionItem
              key={`${city.name}-${city.country}`}
              onClick={() => handleCitySelect(city)}
            >
              {city.name}, {city.country}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </Container>
  );
};
