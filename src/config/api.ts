export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  drive: {
    list: `${API_BASE_URL}/api/drive/list`,
  },
  auth: {
    google: `${API_BASE_URL}/api/auth/google`,
    callback: `${API_BASE_URL}/api/auth/google/callback`,
  },
}; 