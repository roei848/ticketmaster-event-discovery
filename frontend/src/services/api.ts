import axios from 'axios';
import type { Event, EventDetail, SearchParams } from '../types';

const API_BASE_URL = '/api';

export const searchEvents = async (params: SearchParams): Promise<Event[]> => {
  const queryParams = new URLSearchParams({
    city: params.city,
    radius: params.radius.toString(),
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
  });

  params.eventTypes.forEach(type => {
    queryParams.append('eventTypes', type);
  });

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
