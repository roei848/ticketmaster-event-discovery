import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Event, EventDetail } from '../../types';
import { getEventDetail } from '../../services/api';

interface EventDetailModalStyledProps {
  event: Event;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};

  h3 {
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  p {
    font-size: ${props => props.theme.typography.fontSize.md};
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
    margin: ${props => props.theme.spacing.xs} 0;
  }
`;

const ModalPrice = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.error};
`;

const BuyTicketsLink = styled.a`
  display: inline-block;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  transition: background 0.2s;
  margin-top: ${props => props.theme.spacing.lg};

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

const EventDetailModalStyled = ({ event, onClose }: EventDetailModalStyledProps) => {
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
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        {loading && <LoadingMessage>Loading...</LoadingMessage>}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {eventDetail && !loading && (
          <>
            {eventDetail.imageUrl && (
              <ModalImage src={eventDetail.imageUrl} alt={eventDetail.name} />
            )}

            <ModalBody>
              <ModalTitle>{eventDetail.name}</ModalTitle>

              <ModalSection>
                <h3>When</h3>
                <p>{formatDate(eventDetail.date)}</p>
              </ModalSection>

              <ModalSection>
                <h3>Where</h3>
                <p><strong>{eventDetail.venueName}</strong></p>
                {eventDetail.venueAddress && <p>{eventDetail.venueAddress}</p>}
                <p>{eventDetail.city}, {eventDetail.country}</p>
              </ModalSection>

              {eventDetail.description && (
                <ModalSection>
                  <h3>About</h3>
                  <p>{eventDetail.description}</p>
                </ModalSection>
              )}

              {eventDetail.priceRange && (
                <ModalSection>
                  <h3>Price Range</h3>
                  <ModalPrice>
                    {eventDetail.priceRange.currency} {eventDetail.priceRange.min} - {eventDetail.priceRange.max}
                  </ModalPrice>
                </ModalSection>
              )}

              {eventDetail.promoter && (
                <ModalSection>
                  <h3>Promoter</h3>
                  <p>{eventDetail.promoter}</p>
                </ModalSection>
              )}

              <BuyTicketsLink
                href={eventDetail.ticketmasterUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy Tickets on Ticketmaster
              </BuyTicketsLink>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default EventDetailModalStyled;
