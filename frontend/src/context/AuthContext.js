// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) On mount, fetch the current profile
  useEffect(() => {
    (async () => {
      try {
        const profile = await fetchProfile();
        setUser(profile || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) LOGIN
  const login = async (credentials) => {
    const loggedInUser = await apiLogin(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  // 3) REGISTER
  const register = async (details) => {
    const newUser = await apiRegister(details);
    setUser(newUser);
    return newUser;
  };

  // 4) LOGOUT + redirect
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // clear user state
      setUser(null);
      // clear persisted data
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      // redirect home
      navigate('/');
    }
  };

  // While loading, don’t render children
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
