import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { getUserTimezone } from '../utils/date';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('remindly_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('remindly_token') || null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('remindly_token', token);
    } else {
      localStorage.removeItem('remindly_token');
    }
  }, [token]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('remindly_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('remindly_user');
    }
  }, [user]);

  // Refresh profile from server on initial load if logged in
  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    authApi
      .getMe()
      .then((data) => {
        if (isMounted && data) {
          setUser((prev) => ({
            ...prev,
            ...data,
            timezone: data.timezone || prev?.timezone || getUserTimezone(),
          }));
        }
      })
      .catch((err) => {
        // If 401 unauthorized, logout
        if (err.response?.status === 401) {
          logout();
        }
      });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.login({ email, password });
      const enrichedUser = {
        ...data.user,
        timezone: data.user?.timezone || getUserTimezone(),
      };
      setToken(data.token);
      setUser(enrichedUser);
      return enrichedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ name, email, password, timezone }) => {
    setIsLoading(true);
    try {
      const tz = timezone || getUserTimezone();
      const data = await authApi.register({ name, email, password, timezone: tz });
      const enrichedUser = {
        ...data.user,
        timezone: data.user?.timezone || tz,
      };
      setToken(data.token);
      setUser(enrichedUser);
      return enrichedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('remindly_token');
    localStorage.removeItem('remindly_user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('remindly_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
