// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import {
  fetchProfile,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout
} from '../utils/api';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, load the current user's profile (or clear if it fails)
  useEffect(() => {
    (async () => {
      try {
        const profile = await fetchProfile();
        console.log('👤 fetched profile:', profile);
        setUser(profile || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // LOGIN
  const login = async (credentials) => {
    const loggedInUser = await apiLogin(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  // REGISTER
  const register = async (details) => {
    const newUser = await apiRegister(details);
    setUser(newUser);
    return newUser;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  // While auth is loading, render nothing (or a spinner)
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
