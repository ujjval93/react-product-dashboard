import React, { createContext, useEffect, useMemo, useState, useRef } from 'react';
import { authApi } from '../utils/api.js';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('authUser')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const prevUserRef = useRef(user);

  // ── Save/clear user in state + localStorage ───────────────────
  const setAuthUser = (data) => {
    setUser(data);
    if (data) {
      localStorage.setItem('authUser', JSON.stringify(data));
    } else {
      localStorage.removeItem('authUser');
    }
  };

  // ── Fetch current logged-in user (with token refresh fallback) ─
  const refreshCurrentUser = async () => {
    try {
      const response = await authApi.currentUser();
      const data = response?.data?.data || response?.data || null;
      setAuthUser(data);
      return data;
    } catch (error) {
      // Silently return null — no toast, no refresh attempt on page load
      setAuthUser(null);
      return null;
    }
  };

  // ── Login ─────────────────────────────────────────────────────
  const login = async (payload) => {
    setAuthError(null);
    try {
      const response = await authApi.login(payload);
      const data = response?.data?.data || response?.data || response;
      const user = data?.user || data;
      setAuthUser(user);
      // Dispatch login event so ProductContext can sync cart/wishlist
      window.dispatchEvent(new CustomEvent('auth:login', { detail: { user } }));
      return data;
    } catch (error) {
      setAuthError(error?.message || 'Login failed');
      throw error;
    }
  };

  // ── Register ──────────────────────────────────────────────────
  const register = async (payload) => {
    setAuthError(null);
    try {
      const response = await authApi.register(payload);
      const data = response?.data?.data || response?.data || response;
      const user = data?.user || data;
      setAuthUser(user);
      // Dispatch login event so ProductContext can sync cart/wishlist
      window.dispatchEvent(new CustomEvent('auth:login', { detail: { user } }));
      return data;
    } catch (error) {
      setAuthError(error?.message || 'Registration failed');
      throw error;
    }
  };

  // ── Logout ────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if API call fails, clear local state
    } finally {
      setAuthUser(null);
    }
  };

  // ── On app load — check if user is still logged in ────────────
  useEffect(() => {
    const init = async () => {
      try {
        const restoredUser = await refreshCurrentUser();
        // If user was restored from cookies, dispatch login event
        if (restoredUser) {
          window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: restoredUser } }));
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ── Listen for forced logout from api.js interceptor ─────────
  useEffect(() => {
    const handleForceLogout = () => {
      setAuthUser(null);
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      login,
      logout,
      register,
      refreshCurrentUser,
      setAuthUser,
    }),
    [user, loading, authError],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;