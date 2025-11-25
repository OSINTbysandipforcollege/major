import axios from 'axios';
import { Alert } from '../models/interfaces';

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
  // Extract location from USGS place string
  const location = place.split(', ')[1] || place;
  // Split into regions if multiple are listed
  return location.split(' and ').map(area => area.trim());
};

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