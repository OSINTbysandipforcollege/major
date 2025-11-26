import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {
    throw new Error('Auth provider not ready');
  },
  register: async () => {
    throw new Error('Auth provider not ready');
  },
  logout: async () => {},
  isAuthenticated: false,
  isAdmin: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const USER_STORAGE_KEY = 'resq_user';
const TOKEN_STORAGE_KEY = 'resq_token';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 second timeout
});

const setAuthHeader = (token?: string) => {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.warn('Failed to parse saved user', err);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setAuthHeader(savedToken);

    const verifySession = async () => {
      try {
        const response = await http.get<{ user: User }>('/auth/me');
        setUser(response.data.user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      } catch (err) {
        // If backend is unavailable, keep user logged in from localStorage
        // Only clear session if token is explicitly invalid (401)
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            clearSession();
          } else if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
            // Backend is down or unreachable, but user can still use the app with cached data
            console.warn('Backend unavailable, using cached session');
          } else {
            console.warn('Could not verify session with backend', err);
          }
        } else {
          console.warn('Unexpected error verifying session', err);
        }
      } finally {
        // Always set loading to false, even if there's an error
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const persistSession = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAuthHeader(token);
  };

  const clearSession = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthHeader(undefined);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http.post<{ token: string; user: User }>('/auth/login', {
        email,
        password,
      });

      persistSession(response.data.user, response.data.token);
      return response.data.user;
    } catch (err) {
      let message = 'Login failed';
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK' || !err.response) {
          message = 'Cannot connect to server. Please make sure the backend is running.';
        } else if (err.response?.status === 401) {
          message = err.response.data?.message || 'Invalid email or password.';
        } else if (err.response?.status === 400) {
          message = err.response.data?.message || 'Please provide both email and password.';
        } else {
          message = err.response?.data?.message || 'Login failed. Please try again.';
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, location?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http.post<{ token: string; user: User }>('/auth/register', {
        name,
        email,
        password,
        location,
      });

      persistSession(response.data.user, response.data.token);
      return response.data.user;
    } catch (err) {
      let message = 'Registration failed';
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK' || !err.response) {
          message = 'Cannot connect to server. Please make sure the backend is running.';
        } else if (err.response?.status === 409) {
          message = err.response.data?.message || 'A user with this email already exists.';
        } else if (err.response?.status === 400) {
          message = err.response.data?.message || 'Please fill in all required fields.';
        } else {
          message = err.response?.data?.message || 'Registration failed. Please try again.';
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await http.post('/auth/logout');
    } catch (err) {
      console.warn('Logout failed', err);
    } finally {
      clearSession();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);