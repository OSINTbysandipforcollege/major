import axios from 'axios';
import { Event } from '../models/interfaces';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Set auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('resq_token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await http.get<{ events: Event[] }>('/events', {
      headers: getAuthHeaders(),
    });
    return response.data.events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};

export const fetchEvent = async (id: string): Promise<Event> => {
  try {
    const response = await http.get<{ event: Event }>(`/events/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
  }
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'isCompleted'>): Promise<Event> => {
  try {
    const response = await http.post<{ event: Event }>('/events', eventData, {
      headers: getAuthHeaders(),
    });
    return response.data.event;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
    throw new Error('Failed to create event');
  }
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  try {
    const response = await http.put<{ event: Event }>(`/events/${id}`, eventData, {
      headers: getAuthHeaders(),
    });
    return response.data.event;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
    throw new Error('Failed to update event');
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await http.delete(`/events/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
    throw new Error('Failed to delete event');
  }
};

