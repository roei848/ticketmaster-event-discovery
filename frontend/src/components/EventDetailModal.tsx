import { useEffect, useState } from 'react';
import type { Event, EventDetail } from '../types';
import { getEventDetail } from '../services/api';
import './EventDetailModal.css';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const detail = await getEventDetail(event.id);
        setEventDetail(detail);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [event.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {loading && <div className="modal-loading">Loading...</div>}

        {error && <div className="modal-error">{error}</div>}

        {eventDetail && !loading && (
          <>
            {eventDetail.imageUrl && (
              <img src={eventDetail.imageUrl} alt={eventDetail.name} className="modal-image" />
            )}

            <div className="modal-body">
              <h2 className="modal-title">{eventDetail.name}</h2>

              <div className="modal-section">
                <h3>When</h3>
                <p>{formatDate(eventDetail.date)}</p>
              </div>

              <div className="modal-section">
                <h3>Where</h3>
                <p><strong>{eventDetail.venueName}</strong></p>
                {eventDetail.venueAddress && <p>{eventDetail.venueAddress}</p>}
                <p>{eventDetail.city}, {eventDetail.country}</p>
              </div>

              {eventDetail.description && (
                <div className="modal-section">
                  <h3>About</h3>
                  <p>{eventDetail.description}</p>
                </div>
              )}

              {eventDetail.priceRange && (
                <div className="modal-section">
                  <h3>Price Range</h3>
                  <p className="modal-price">
                    {eventDetail.priceRange.currency} {eventDetail.priceRange.min} - {eventDetail.priceRange.max}
                  </p>
                </div>
              )}

              {eventDetail.promoter && (
                <div className="modal-section">
                  <h3>Promoter</h3>
                  <p>{eventDetail.promoter}</p>
                </div>
              )}

              <a
                href={eventDetail.ticketmasterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-tickets-button"
              >
                Buy Tickets on Ticketmaster
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
