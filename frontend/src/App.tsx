import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { lightTheme, darkTheme } from './theme/theme';
import { GlobalStyles } from './theme/GlobalStyles';
import SearchBarStyled from './components/organisms/SearchBarStyled';
import EventGridStyled from './components/organisms/EventGridStyled';
import EventDetailModalStyled from './components/organisms/EventDetailModalStyled';
import { ThemeToggleSwitch } from './components/molecules/ThemeToggleSwitch';
import { Spinner } from './components/atoms/Spinner';
import { ErrorBox } from './components/atoms/ErrorBox';
import { cities } from './data/cities';
import { searchEvents } from './services/api';
import type { Event, City } from './types';

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
        <AppHeader>
          <HeaderContent>
            <h1>Ticketmaster Event Discovery</h1>
            <p>Find events near you worldwide</p>
          </HeaderContent>
          <ThemeToggleSwitch isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
        </AppHeader>

        <main className="app-main">
          <SearchBarStyled cities={cities} onSearch={handleSearch} />

          {loading && <Spinner />}

          {error && <ErrorBox message={error} />}

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

const AppHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;

  h1 {
    margin: 0;
    font-size: 2rem;
    color: ${props => props.theme.colors.text};
  }

  p {
    margin: ${props => props.theme.spacing.xs} 0 0 0;
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

export default App;
