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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  location: string;
  verified: boolean;
  createdAt: string;
}

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await http.get<{ users: User[] }>('/users', {
      headers: getAuthHeaders(),
    });
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
    throw new Error('Failed to fetch users');
  }
};

export const verifyUser = async (userId: string, verified: boolean): Promise<User> => {
  try {
    const response = await http.put<{ user: User }>(
      `/users/${userId}/verify`,
      { verified },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to verify user');
    }
    throw new Error('Failed to verify user');
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await http.delete(`/users/${userId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
    throw new Error('Failed to delete user');
  }
};

