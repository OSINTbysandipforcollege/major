import axios from 'axios';

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

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  event?: {
    id: string;
    title: string;
    organization: string;
    description: string;
    location: string;
    date: string;
    isCompleted: boolean;
  };
}

export const registerForEvent = async (eventId: string): Promise<Registration> => {
  try {
    const response = await http.post<{ message: string; registration: Registration }>(
      '/registrations',
      { eventId },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.registration;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to register for event');
    }
    throw new Error('Failed to register for event');
  }
};

export const checkRegistration = async (eventId: string): Promise<boolean> => {
  try {
    const response = await http.get<{ isRegistered: boolean }>(
      `/registrations/check/${eventId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.isRegistered;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
};

export const getMyRegistrations = async (): Promise<Registration[]> => {
  try {
    const response = await http.get<{ registrations: Registration[] }>(
      '/registrations/my-registrations',
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.registrations;
  } catch (error) {
    console.error('Error fetching registrations:', error);
    throw new Error('Failed to fetch registrations');
  }
};

export const cancelRegistration = async (eventId: string): Promise<void> => {
  try {
    await http.delete(`/registrations/${eventId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to cancel registration');
    }
    throw new Error('Failed to cancel registration');
  }
};

