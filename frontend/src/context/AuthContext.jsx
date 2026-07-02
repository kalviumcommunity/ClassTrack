import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import ReactGA from 'react-ga4';

export const AuthContext = createContext();

// Configure GA4 — replace with real GA_MEASUREMENT_ID when available
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
ReactGA.initialize(GA_MEASUREMENT_ID, {
  testMode: GA_MEASUREMENT_ID === 'G-XXXXXXXXXX', // silent in dev if no key
});

// Configured Axios instance for clean API calls
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync token from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('classtrack_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  // Helper to store user session
  const _storeUser = (userData) => {
    setUser(userData);
    localStorage.setItem('classtrack_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const userData = res.data;
      _storeUser(userData);

      // GA4 login event
      ReactGA.event({ category: 'Auth', action: 'login', label: userData.role });

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login request error:', error);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    }
  };

  const signup = async (payload) => {
    try {
      const res = await api.post('/auth/signup', payload);
      const userData = res.data;
      _storeUser(userData);

      // GA4 signup event
      ReactGA.event({ category: 'Auth', action: 'signup', label: userData.role });

      return { success: true, user: userData };
    } catch (error) {
      console.error('Signup request error:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      throw { response: { data: { message } } };
    }
  };

  const logout = () => {
    ReactGA.event({ category: 'Auth', action: 'logout' });
    setUser(null);
    localStorage.removeItem('classtrack_user');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      const userData = res.data;
      _storeUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Update profile request error:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      return { success: false, message };
    }
  };

  // Track page views
  const trackPageView = (path) => {
    ReactGA.send({ hitType: 'pageview', page: path });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, trackPageView }}>
      {children}
    </AuthContext.Provider>
  );
};
