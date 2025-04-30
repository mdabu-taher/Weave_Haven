// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api, {
  fetchProfile as apiFetchProfile,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, load the profile if token is present
  useEffect(() => {
    (async () => {
      const profile = await apiFetchProfile();
      if (profile) setUser(profile);
    })();
  }, []);

  // Login via our api helper
  const login = async (email, password) => {
    const loggedInUser = await apiLogin({ email, password });
    setUser(loggedInUser);
    return loggedInUser;
  };

  // Register via our api helper
  const register = async (username, email, password) => {
    const newUser = await apiRegister({ username, email, password });
    setUser(newUser);
    return newUser;
  };

  // Logout via our api helper
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
