import type { Event } from '../types';
import './EventGrid.css';

interface EventGridProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function EventGrid({ events, onEventClick }: EventGridProps) {
  if (events.length === 0) {
    return <div className="no-results">No events found. Try adjusting your search criteria.</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-grid">
      {events.map((event) => (
        <div
          key={event.id}
          className="event-card"
          onClick={() => onEventClick(event)}
        >
          <div className="event-image-container">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.name} className="event-image" />
            ) : (
              <div className="event-image-placeholder">No Image</div>
            )}
          </div>

          <div className="event-info">
            <h3 className="event-name">{event.name}</h3>

            <div className="event-detail">
              <span className="event-date">{formatDate(event.date)}</span>
            </div>

            <div className="event-detail">
              <span className="event-venue">{event.venueName}</span>
            </div>

            <div className="event-detail">
              <span className="event-location">{event.city}, {event.country}</span>
            </div>

            {event.priceRange && (
              <div className="event-price">
                {event.priceRange.currency} {event.priceRange.min} - {event.priceRange.max}
              </div>
            )}

            <span className="event-category">{event.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
