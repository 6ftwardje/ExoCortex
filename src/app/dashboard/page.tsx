"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for JWT in cookies
    if (typeof window !== 'undefined') {
      const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      if (!jwt) {
        router.replace('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    // Remove JWT cookie (for demo; in production, backend should handle logout)
    document.cookie = 'jwt=; Max-Age=0; path=/;';
    router.replace('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Dashboard</h1>
      <p>Welcome! You are authenticated.</p>
      <button style={{ margin: '1rem', padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }} onClick={handleLogout}>
        Logout
      </button>
      <button style={{ padding: '0.5rem 1rem', background: '#4285F4', color: '#fff', border: 'none', borderRadius: '4px' }} onClick={() => router.push('/login')}>
        Go to Login
      </button>
    </div>
  );
} 