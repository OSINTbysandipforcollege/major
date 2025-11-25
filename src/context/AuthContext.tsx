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
      setUser(JSON.parse(savedUser));
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
      } catch {
        clearSession();
      } finally {
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
      const message = extractErrorMessage(err, 'Login failed');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http.post<{ token: string; user: User }>('/auth/register', {
        name,
        email,
        password,
      });

      persistSession(response.data.user, response.data.token);
      return response.data.user;
    } catch (err) {
      const message = extractErrorMessage(err, 'Registration failed');
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