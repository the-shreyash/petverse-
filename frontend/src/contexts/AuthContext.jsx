import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      // Backend /auth/me returns { data: UserResponse, ... }
      const response = await api.get('/auth/me');
      const userData = response.data?.data || response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to fetch current user", error);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    try {
      // Backend expects JSON { email, password }
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const responseData = response.data?.data || response.data;
      const { access_token, refresh_token } = responseData.tokens;
      localStorage.setItem('token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      setUser(responseData.user);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const responseData = response.data?.data || response.data;
      const { access_token, refresh_token } = responseData.tokens;
      localStorage.setItem('token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      setUser(responseData.user);
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch (e) {
      // Silently ignore logout errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('petverse_selected_pet_id');
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const storedRefresh = localStorage.getItem('refresh_token');
      if (!storedRefresh) return false;
      const response = await api.post('/auth/refresh', { refresh_token: storedRefresh });
      const responseData = response.data?.data || response.data;
      const { access_token, refresh_token: newRefresh } = responseData.tokens;
      localStorage.setItem('token', access_token);
      if (newRefresh) localStorage.setItem('refresh_token', newRefresh);
      setUser(responseData.user);
      return true;
    } catch (e) {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, fetchCurrentUser, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
