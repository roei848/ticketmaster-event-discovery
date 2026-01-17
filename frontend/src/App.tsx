import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme/theme';
import { GlobalStyles } from './theme/GlobalStyles';
import SearchBarStyled from './components/organisms/SearchBarStyled';
import EventGridStyled from './components/organisms/EventGridStyled';
import EventDetailModalStyled from './components/organisms/EventDetailModalStyled';
import { ThemeToggle } from './components/ThemeToggle';
import { cities } from './data/cities';
import { searchEvents } from './services/api';
import type { Event, City } from './types';
import './App.css';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleSearch = async (city: City, radius: number, eventTypes: string[], startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const results = await searchEvents({
        city: city.name,
        radius,
        latitude: city.lat,
        longitude: city.lon,
        eventTypes,
        startDate,
        endDate
      });

      setEvents(results);
    } catch (err) {
      setError('Failed to search events. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyles />
      <div className="app">
        <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />

        <header className="app-header">
          <h1>Ticketmaster Event Discovery</h1>
          <p>Find events near you worldwide</p>
        </header>

        <main className="app-main">
          <SearchBarStyled cities={cities} onSearch={handleSearch} />

          {loading && <div className="loading">Searching for events...</div>}

          {error && <div className="error">{error}</div>}

          {!loading && hasSearched && <EventGridStyled events={events} onEventClick={setSelectedEvent} />}
        </main>

        {selectedEvent && (
          <EventDetailModalStyled
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
