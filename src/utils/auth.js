import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken());
  const [sessionWarning, setSessionWarning] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setUser(getUserFromToken());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Session timeout handler
  useEffect(() => {
    if (!user) return;

    const token = getToken();
    if (!token) return;

    const checkSession = () => {
      if (isTokenExpired(token)) {
        logout();
        return;
      }

      const decoded = jwtDecode(token);
      const timeUntilExpiry = (decoded.exp * 1000) - Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (timeUntilExpiry <= fiveMinutes && timeUntilExpiry > 0) {
        setSessionWarning(true);
      } else {
        setSessionWarning(false);
      }
    };

    // Check immediately
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const login = (token) => {
    setToken(token);
    setUser(getUserFromToken());
    setSessionWarning(false);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setSessionWarning(false);
  };

  const extendSession = () => {
    // This would typically involve refreshing the token from the server
    // For now, we'll just clear the warning
    setSessionWarning(false);
  };

  const value = useMemo(
    () => ({ user, login, logout, extendSession, sessionWarning }),
    [user, sessionWarning]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const getUserRole = () => getUserFromToken()?.role || null;
export const getUser = () => getUserFromToken();

