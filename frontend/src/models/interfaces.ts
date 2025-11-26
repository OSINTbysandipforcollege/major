export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Event {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  date: string;
  isCompleted: boolean;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'minor' | 'moderate' | 'major' | 'catastrophic';
  date: string;
  affectedAreas: string[];
  details?: string;
  region?: string;
}

export interface Contact {
  id: string;
  name: string;
  location: string;
  phone: string;
}