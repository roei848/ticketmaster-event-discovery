import React from 'react';
import styled from 'styled-components';

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

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.theme.colors.border};
  overflow: hidden;
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
  gap: ${props => props.theme.spacing.sm};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
`;

const Venue = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.textSecondary};
`;

const Date = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const Price = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            No Image
          </div>
        )}
      </ImageContainer>
      <CardContent>
        <Title>{title}</Title>
        <Venue>{venue}</Venue>
        <Date>{date}</Date>
        {price && <Price>{price}</Price>}
      </CardContent>
    </Card>
  );
};
