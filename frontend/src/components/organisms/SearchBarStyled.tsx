import { useState } from 'react';
import styled from 'styled-components';
import type { City } from '../../types';
import { CityAutocomplete } from '../molecules/CityAutocomplete';
import { RadiusSelector } from '../molecules/RadiusSelector';
import { DateRangePicker } from '../molecules/DateRangePicker';
import { EventTypeFilter } from '../molecules/EventTypeFilter';
import { Button } from '../atoms/Button';

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
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: ${props => props.theme.spacing.xl};
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

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <Button onClick={handleSearch} variant="primary">
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
