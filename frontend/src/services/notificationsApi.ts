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

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await http.get<{ notifications: Notification[] }>('/notifications', {
      headers: getAuthHeaders(),
    });
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
};

export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await http.get<{ count: number }>('/notifications/unread/count', {
      headers: getAuthHeaders(),
    });
    return response.data.count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};

export const markAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await http.put<{ notification: Notification }>(
      `/notifications/${notificationId}/read`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.notification;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
    throw new Error('Failed to mark notification as read');
  }
};

export const markAllAsRead = async (): Promise<void> => {
  try {
    await http.put(
      '/notifications/read-all',
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to mark all as read');
    }
    throw new Error('Failed to mark all as read');
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await http.delete(`/notifications/${notificationId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
    throw new Error('Failed to delete notification');
  }
};

