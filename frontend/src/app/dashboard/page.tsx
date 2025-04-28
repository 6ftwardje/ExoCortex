'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/constants';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const { user, isLoading, checkAuth, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('Dashboard: Checking for token in URL...');
    const token = searchParams.get('token');
    if (token) {
      console.log('Dashboard: Token found in URL, setting in cookies...');
      // Set the token in cookies with proper options
      Cookies.set('token', token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      // Remove token from URL
      window.history.replaceState({}, '', '/dashboard');
      // Check auth with the new token
      console.log('Dashboard: Checking auth with new token...');
      checkAuth();
    }
  }, [searchParams, checkAuth]);

  useEffect(() => {
    console.log('Dashboard: Checking user state...', { user, isLoading });
    if (!isLoading && !user) {
      console.log('Dashboard: No user found, redirecting to login...');
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('Dashboard: Loading state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not loading and no user, show nothing (will redirect in useEffect)
  if (!user) {
    console.log('Dashboard: No user found, returning null...');
    return null;
  }

  console.log('Dashboard: Rendering with user:', user);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">ExoCortex</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user.name}</span>
              <button
                onClick={() => {
                  console.log('Dashboard: Logout button clicked');
                  logout();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your Dashboard</h2>
            <p className="text-gray-600">
              Your Google Drive structure will be displayed here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 