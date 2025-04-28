// API and server configuration
export const API_CONFIG = {
  // Server ports
  FRONTEND_PORT: 3002,
  BACKEND_PORT: 3001,
  
  // API URLs
  BACKEND_URL: `http://localhost:3001`,
  API_BASE_URL: `http://localhost:3001/api`,
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      GOOGLE: '/auth/google',
      CALLBACK: '/auth/google/callback',
      ME: '/auth/me',
      LOGOUT: '/auth/logout',
    },
    DRIVE: {
      LIST: '/drive/list',
      FOLDERS: '/drive/folders',
      FILES: '/drive/files',
      CLEAR_CACHE: '/drive/clear-cache',
    },
  },
} as const; 