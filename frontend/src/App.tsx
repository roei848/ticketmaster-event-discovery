import { useState } from 'react';
import SearchBar from './components/SearchBar';
import EventGrid from './components/EventGrid';
import EventDetailModal from './components/EventDetailModal';
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

  const handleSearch = async (city: City, radius: number, eventTypes: string[]) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const results = await searchEvents({
        city: city.name,
        radius,
        latitude: city.lat,
        longitude: city.lon,
        eventTypes
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
    <div className="app">
      <header className="app-header">
        <h1>Ticketmaster Event Discovery</h1>
        <p>Find events near you worldwide</p>
      </header>

      <main className="app-main">
        <SearchBar cities={cities} onSearch={handleSearch} />

        {loading && <div className="loading">Searching for events...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && hasSearched && <EventGrid events={events} onEventClick={setSelectedEvent} />}
      </main>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

export default App;
