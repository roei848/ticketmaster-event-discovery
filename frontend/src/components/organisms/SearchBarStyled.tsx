import { useState } from 'react';
import { Search } from 'lucide-react';
import styled from 'styled-components';
import type { City } from '../../types';
import { Button } from '../atoms/Button';
import { RadiusSelector } from '../molecules/RadiusSelector';
import { EventTypeFilter } from '../molecules/EventTypeFilter';
import { CityAutocomplete } from '../molecules/CityAutocomplete';
import { DatePickerContainer } from '../molecules/DatePickerContainer';

interface SearchBarStyledProps {
  cities: City[];
  onSearch: (city: City, radius: number, eventTypes: string[], startDate?: string, endDate?: string) => void;
}

// Local City type for CityAutocomplete
interface LocalCity {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

const SearchBarContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryHover});
    border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: flex-end;
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBarStyled = ({ cities, onSearch }: SearchBarStyledProps) => {
  const [cityInput, setCityInput] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [radius, setRadius] = useState(25);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Convert City to LocalCity for CityAutocomplete
  const localCities: LocalCity[] = cities.map(city => ({
    name: city.name,
    country: city.country,
    latitude: city.lat,
    longitude: city.lon
  }));

  const selectedLocalCity: LocalCity | null = selectedCity ? {
    name: selectedCity.name,
    country: selectedCity.country,
    latitude: selectedCity.lat,
    longitude: selectedCity.lon
  } : null;

  const handleCitySelect = (localCity: LocalCity) => {
    const city: City = {
      name: localCity.name,
      country: localCity.country,
      lat: localCity.latitude,
      lon: localCity.longitude
    };
    setSelectedCity(city);
    setCityInput(localCity.name); // Fix: Update input to show selected city name
  };

  const handleSearch = () => {
    if (!selectedCity) {
      alert('Please select a city');
      return;
    }

    onSearch(selectedCity, radius, selectedEventTypes, startDate, endDate);
  };

  return (
    <SearchBarContainer>
      <SearchRow>
        <CityAutocomplete
          cities={localCities}
          value={cityInput}
          selectedCity={selectedLocalCity}
          onCityChange={setCityInput}
          onCitySelect={handleCitySelect}
        />

        <RadiusSelector
          value={radius}
          onChange={setRadius}
        />

        <DatePickerContainer
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <Button onClick={handleSearch} variant="primary" icon={<Search size={20} />}>
          Search
        </Button>
      </SearchRow>

      <EventTypeFilter
        selectedTypes={selectedEventTypes}
        onChange={setSelectedEventTypes}
      />
    </SearchBarContainer>
  );
};

export default SearchBarStyled;
