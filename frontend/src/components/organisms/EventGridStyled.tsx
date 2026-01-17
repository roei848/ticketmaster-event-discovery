import styled from 'styled-components';
import type { Event } from '../../types';
import { EventCard } from '../molecules/EventCard';

interface EventGridStyledProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${props => props.theme.spacing.md};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
`;

const EventGridStyled = ({ events, onEventClick }: EventGridStyledProps) => {
  if (events.length === 0) {
    return <NoResults>No events found. Try adjusting your search criteria.</NoResults>;
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

  const formatPrice = (event: Event) => {
    if (!event.priceRange) return undefined;
    return `${event.priceRange.currency} ${event.priceRange.min} - ${event.priceRange.max}`;
  };

  return (
    <GridContainer>
      {events.map((event) => (
        <EventCard
          key={event.id}
          title={event.name}
          venue={`${event.venueName} - ${event.city}, ${event.country}`}
          date={formatDate(event.date)}
          price={formatPrice(event)}
          imageUrl={event.imageUrl}
          onClick={() => onEventClick(event)}
        />
      ))}
    </GridContainer>
  );
};

export default EventGridStyled;
