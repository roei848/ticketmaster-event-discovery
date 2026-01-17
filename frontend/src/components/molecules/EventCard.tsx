import React from 'react';
import styled from 'styled-components';
import { MapPin, Calendar, Ticket, Image as ImageIcon } from 'lucide-react';

interface EventCardProps {
  title: string;
  venue: string;
  date: string;
  price?: string;
  imageUrl?: string;
  onClick: () => void;
}

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}20, ${props => props.theme.colors.primaryHover}20);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`;

const PlaceholderIcon = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.3;
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
`;

const InfoText = styled.span`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.5;
`;

const PriceRow = styled(InfoRow)`
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.md};
  margin-top: ${props => props.theme.spacing.xs};
`;

export const EventCard: React.FC<EventCardProps> = ({
  title,
  venue,
  date,
  price,
  imageUrl,
  onClick
}) => {
  return (
    <Card onClick={onClick}>
      <ImageContainer>
        {imageUrl ? (
          <EventImage src={imageUrl} alt={title} />
        ) : (
          <PlaceholderIcon>
            <ImageIcon size={64} strokeWidth={1} />
          </PlaceholderIcon>
        )}
      </ImageContainer>
      <CardContent>
        <Title>{title}</Title>
        <InfoRow>
          <IconWrapper>
            <MapPin size={16} />
          </IconWrapper>
          <InfoText>{venue}</InfoText>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <Calendar size={16} />
          </IconWrapper>
          <InfoText>{date}</InfoText>
        </InfoRow>
        {price && (
          <PriceRow>
            <IconWrapper>
              <Ticket size={18} />
            </IconWrapper>
            <InfoText>{price}</InfoText>
          </PriceRow>
        )}
      </CardContent>
    </Card>
  );
};
