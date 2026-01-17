import axios from 'axios';
import type { Event, EventDetail, SearchParams } from '../types';

const API_BASE_URL = '/api';

export const searchEvents = async (params: SearchParams): Promise<Event[]> => {
  // Convert kilometers to miles for the API (1 km = 0.621371 miles)
  const radiusInMiles = Math.round(params.radius * 0.621371);

  const queryParams = new URLSearchParams({
    city: params.city,
    radius: radiusInMiles.toString(),
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
  });

  params.eventTypes.forEach(type => {
    queryParams.append('eventTypes', type);
  });

  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }

  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }

  const response = await axios.get<Event[]>(
    `${API_BASE_URL}/events/search?${queryParams.toString()}`
  );

  return response.data;
};

export const getEventDetail = async (eventId: string): Promise<EventDetail> => {
  const response = await axios.get<EventDetail>(
    `${API_BASE_URL}/events/${eventId}`
  );

  return response.data;
};
