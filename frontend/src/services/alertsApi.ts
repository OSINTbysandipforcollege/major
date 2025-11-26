import axios from 'axios';
import { Alert } from '../models/interfaces';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// External USGS API for disaster data (used by user dashboard)
const USGS_API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

interface USGSFeature {
  properties: {
    mag: number;
    place: string;
    time: number;
    alert: string | null;
    tsunami: number;
  };
  geometry: {
    coordinates: number[];
  };
}

const getSeverity = (magnitude: number): Alert['severity'] => {
  if (magnitude >= 7.0) return 'catastrophic';
  if (magnitude >= 6.0) return 'major';
  if (magnitude >= 5.0) return 'moderate';
  return 'minor';
};

const getAffectedAreas = (place: string): string[] => {
  const location = place.split(', ')[1] || place;
  return location.split(' and ').map(area => area.trim());
};

// Fetch external disaster alerts from USGS (for user dashboard)
export const fetchDisasterAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await axios.get(USGS_API_URL);
    const features: USGSFeature[] = response.data.features;

    return features.map(feature => ({
      id: String(feature.properties.time),
      title: `Earthquake: ${feature.properties.place}`,
      severity: getSeverity(feature.properties.mag),
      date: new Date(feature.properties.time).toISOString(),
      affectedAreas: getAffectedAreas(feature.properties.place),
      details: `Magnitude ${feature.properties.mag} earthquake detected. ${
        feature.properties.tsunami ? 'Tsunami warning issued.' : ''
      }`
    }));
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    throw new Error('Failed to fetch disaster alerts');
  }
};

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

export const fetchAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await http.get<{ alerts: Alert[] }>('/alerts', {
      headers: getAuthHeaders(),
    });
    return response.data.alerts;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw new Error('Failed to fetch alerts');
  }
};

export const fetchAlert = async (id: string): Promise<Alert> => {
  try {
    const response = await http.get<{ alert: Alert }>(`/alerts/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.alert;
  } catch (error) {
    console.error('Error fetching alert:', error);
    throw new Error('Failed to fetch alert');
  }
};

export interface CreateAlertData {
  title: string;
  severity: 'minor' | 'moderate' | 'major' | 'catastrophic';
  affectedAreas: string[];
  details?: string;
  region?: string;
}

export const createAlert = async (alertData: CreateAlertData): Promise<Alert> => {
  try {
    const response = await http.post<{ alert: Alert }>('/alerts', alertData, {
      headers: getAuthHeaders(),
    });
    return response.data.alert;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create alert');
    }
    throw new Error('Failed to create alert');
  }
};

export const updateAlert = async (id: string, alertData: Partial<CreateAlertData>): Promise<Alert> => {
  try {
    const response = await http.put<{ alert: Alert }>(`/alerts/${id}`, alertData, {
      headers: getAuthHeaders(),
    });
    return response.data.alert;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update alert');
    }
    throw new Error('Failed to update alert');
  }
};

export const deleteAlert = async (id: string): Promise<void> => {
  try {
    await http.delete(`/alerts/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete alert');
    }
    throw new Error('Failed to delete alert');
  }
};
