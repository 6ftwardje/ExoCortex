'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, AuthState, User } from '@/types/auth';
import { API_CONFIG } from '@/config/constants';
import axiosInstance from '@/config/axios';

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
    console.log('AuthContext: Initiating login...');
    window.location.href = `${API_CONFIG.API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE}`;
  };

  const logout = async () => {
    console.log('AuthContext: Starting logout process...');
    try {
      // Clear user state first to prevent flashing of dashboard
      setState({ ...state, user: null, isLoading: false });
      
      // Clear drive cache
      console.log('AuthContext: Clearing drive cache...');
      await axiosInstance.post(API_CONFIG.ENDPOINTS.DRIVE.CLEAR_CACHE);
      
      // Then logout
      console.log('AuthContext: Calling logout endpoint...');
      await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      
      console.log('AuthContext: Redirecting to login page...');
      // Use window.location for a hard redirect to ensure clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
      setState({ ...state, error: 'Failed to logout', isLoading: false });
    }
  };

  const checkAuth = async () => {
    console.log('AuthContext: Checking authentication...');
    try {
      console.log('AuthContext: Fetching user data...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.AUTH.ME);
      console.log('AuthContext: User data received:', response.data);
      setState({
        user: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('AuthContext: Authentication check error:', error);
      setState({
        user: null,
        isLoading: false,
        error: 'Not authenticated',
      });
    }
  };

  useEffect(() => {
    console.log('AuthContext: Initial auth check...');
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