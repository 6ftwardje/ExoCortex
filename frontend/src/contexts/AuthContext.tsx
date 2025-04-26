'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContextType, AuthState, User } from '@/types/auth';

const BACKEND_URL = 'http://localhost:3000';

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  const login = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/logout`, {}, {
        withCredentials: true
      });
      setState({ ...state, user: null });
      router.push('/login');
    } catch (error) {
      setState({ ...state, error: 'Failed to logout' });
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/me`, {
        withCredentials: true
      });
      setState({
        user: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: 'Not authenticated',
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 