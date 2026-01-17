export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Event {
  id: string;
  name: string;
  imageUrl: string;
  date: string;
  venueName: string;
  city: string;
  country: string;
  category: string;
  ticketmasterUrl: string;
  priceRange?: PriceRange;
}

export interface EventDetail extends Event {
  description?: string;
  venueAddress: string;
  latitude: number;
  longitude: number;
  promoter?: string;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface SearchParams {
  city: string;
  radius: number;
  latitude: number;
  longitude: number;
  eventTypes: string[];
}
