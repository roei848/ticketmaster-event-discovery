import { useState, useMemo } from 'react';
import type { City } from '../types';
import './SearchBar.css';

interface SearchBarProps {
  cities: City[];
  onSearch: (city: City, radius: number, eventTypes: string[], startDate?: string, endDate?: string) => void;
}

const EVENT_CATEGORIES = ['Music', 'Sports', 'Arts & Theatre', 'Family'];

const RADIUS_OPTIONS = [10, 25, 50, 100, 200]; // kilometers

export default function SearchBar({ cities, onSearch }: SearchBarProps) {
  const [cityInput, setCityInput] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [radius, setRadius] = useState(25);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredCities = useMemo(() => {
    if (!cityInput) return [];

    return cities
      .filter(city =>
        city.name.toLowerCase().includes(cityInput.toLowerCase()) ||
        city.country.toLowerCase().includes(cityInput.toLowerCase())
      )
      .slice(0, 5);
  }, [cityInput, cities]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityInput(`${city.name}, ${city.country}`);
    setShowSuggestions(false);
  };

  const handleEventTypeToggle = (eventType: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(eventType)
        ? prev.filter(t => t !== eventType)
        : [...prev, eventType]
    );
  };

  const handleSearch = () => {
    if (!selectedCity) {
      alert('Please select a city');
      return;
    }

    onSearch(selectedCity, radius, selectedEventTypes, startDate, endDate);
  };

  return (
    <div className="search-bar">
      <div className="search-row">
        <div className="city-input-container">
          <input
            type="text"
            placeholder="Enter city name..."
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              setSelectedCity(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="city-input"
          />

          {showSuggestions && filteredCities.length > 0 && (
            <ul className="city-suggestions">
              {filteredCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="city-suggestion-item"
                >
                  {city.name}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="radius-container">
          <label>Radius:</label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="radius-select"
          >
            {RADIUS_OPTIONS.map(r => (
              <option key={r} value={r}>{r} km</option>
            ))}
          </select>
        </div>

        <div className="date-container">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="date-container">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>

        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="event-types">
        <label>Event Types:</label>
        <div className="event-type-checkboxes">
          {EVENT_CATEGORIES.map(category => (
            <label key={category} className="event-type-label">
              <input
                type="checkbox"
                checked={selectedEventTypes.includes(category)}
                onChange={() => handleEventTypeToggle(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
