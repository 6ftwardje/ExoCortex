"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for JWT in cookies (simple check, production should use httpOnly cookies and server-side checks)
    if (typeof window !== 'undefined') {
      const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      if (jwt) {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Login</h1>
      <button style={{ padding: '0.5rem 1rem', background: '#4285F4', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem' }} onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
} 