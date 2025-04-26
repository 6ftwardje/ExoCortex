import { Request } from 'express';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photos?: { value: string }[];
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

export interface TokenPayload {
  id: string;
  email: string;
  displayName: string;
  accessToken?: string;
}

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
} 