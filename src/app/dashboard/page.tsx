"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '../../config/api';
import { PromptResponse } from '../../types/prompt';

// Types for Drive structure
interface DriveItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: DriveItem[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [driveStructure, setDriveStructure] = useState<DriveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [promptResponse, setPromptResponse] = useState<PromptResponse | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  useEffect(() => {
    // Check for JWT in cookies
    if (typeof window !== 'undefined') {
      const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      if (!jwt) {
        router.replace('/login');
        return;
      }

      // Fetch Drive structure
      const fetchDriveStructure = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await fetch(API_ENDPOINTS.drive.list, {
            headers: {
              'Authorization': `Bearer ${jwt.split('=')[1]}`
            },
            credentials: 'include' // Include cookies in the request
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch Drive structure');
          }

          const data = await response.json();
          setDriveStructure(data);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          setError(errorMessage);
          console.error('Error fetching Drive structure:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDriveStructure();
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'jwt=; Max-Age=0; path=/;';
    router.replace('/login');
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setIsPromptLoading(true);
      setPromptError(null);
      setPromptResponse(null);

      const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      if (!jwt) {
        router.replace('/login');
        return;
      }

      const response = await fetch(API_ENDPOINTS.prompt.execute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt.split('=')[1]}`
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to execute prompt');
      }

      const data = await response.json();
      setPromptResponse(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setPromptError(errorMessage);
      console.error('Error executing prompt:', err);
    } finally {
      setIsPromptLoading(false);
    }
  };

  // Helper function to render Drive items recursively
  const renderDriveItems = (items: DriveItem[]) => {
    return (
      <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
        {items.map((item) => (
          <li key={item.id} style={{ margin: '0.5rem 0' }}>
            {item.type === 'folder' ? '📁' : '📄'} {item.name}
            {item.children && renderDriveItems(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome! You are authenticated.</p>
      
      {isLoading && <p>Loading Drive structure...</p>}
      {error && (
        <div style={{ color: 'red', margin: '1rem 0', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>
          <p><strong>Error:</strong> {error}</p>
          {error.includes('Firestore database is not initialized') && (
            <p>Please contact the administrator to initialize the Firestore database in the Google Cloud Console.</p>
          )}
          {error.includes('Firestore API is not enabled') && (
            <p>Please contact the administrator to enable the Firestore API in the Google Cloud Console.</p>
          )}
        </div>
      )}
      
      {!isLoading && !error && (
        <div style={{ width: '100%', maxWidth: '800px', marginTop: '2rem' }}>
          <h2>Drive Structure</h2>
          {driveStructure.length > 0 ? (
            renderDriveItems(driveStructure)
          ) : (
            <p>No items found in Drive</p>
          )}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '800px', marginTop: '2rem' }}>
        <h2>Prompt Input</h2>
        <form onSubmit={handlePromptSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt (e.g., 'Place meeting notes in Oasix Meetings')"
            style={{ 
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              minHeight: '100px',
              resize: 'vertical'
            }}
          />
          <button
            type="submit"
            disabled={isPromptLoading || !prompt.trim()}
            style={{
              padding: '0.5rem 1rem',
              background: isPromptLoading ? '#ccc' : '#4285F4',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isPromptLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isPromptLoading ? 'Processing...' : 'Submit Prompt'}
          </button>
        </form>

        {promptError && (
          <div style={{ color: 'red', margin: '1rem 0', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>
            <p><strong>Error:</strong> {promptError}</p>
          </div>
        )}

        {promptResponse && (
          <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h3>Response</h3>
            <p><strong>Action:</strong> {promptResponse.action}</p>
            <p><strong>Folder:</strong> {promptResponse.folderPath.join(' > ')}</p>
            <p><strong>Message:</strong> {promptResponse.message}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button 
          style={{ margin: '1rem', padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }} 
          onClick={handleLogout}
        >
          Logout
        </button>
        <button 
          style={{ padding: '0.5rem 1rem', background: '#4285F4', color: '#fff', border: 'none', borderRadius: '4px' }} 
          onClick={() => router.push('/login')}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
} 