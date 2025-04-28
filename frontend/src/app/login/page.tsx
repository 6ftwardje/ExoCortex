'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { API_CONFIG } from '@/config/constants';

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Login: Checking user state...', { user, isLoading });
    if (!isLoading && user) {
      console.log('Login: User found, redirecting to dashboard...');
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  // Only show loading state if we're actually checking authentication
  // and haven't determined we're not authenticated yet
  if (isLoading && !user) {
    console.log('Login: Loading state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not loading and user exists, show nothing (will redirect in useEffect)
  if (user) {
    console.log('Login: User found, returning null...');
    return null;
  }

  console.log('Login: Rendering login page...');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to ExoCortex</h1>
        <p className="text-gray-600 mb-6 text-center">Connect your Google Drive to get started</p>
        <button
          onClick={login}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.39 30.77 0 24 0 14.82 0 6.71 5.06 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.02l7.19 5.6C43.93 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C.7 16.13 0 19.01 0 22c0 2.99.7 5.87 1.97 8.55l8.7-6.9z"/><path fill="#EA4335" d="M24 44c6.48 0 11.92-2.15 15.89-5.85l-7.19-5.6c-2.01 1.35-4.59 2.15-8.7 2.15-6.38 0-11.87-3.63-14.33-8.9l-8.7 6.9C6.71 42.94 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Connect Google Drive
        </button>
      </div>
    </div>
  );
} 