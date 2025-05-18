import React, { createContext, useState, useEffect, useContext } from 'react';
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

  // On mount, fetch the current user's profile
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
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      window.dispatchEvent(new Event('logout'));
    }
  };

  // While loading, don't render children
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export function useAuth() {
  return useContext(AuthContext);
}
