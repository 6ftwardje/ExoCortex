import request from 'supertest';
import { app, prisma } from '../../test/setup';

describe('Auth Controller', () => {
  describe('POST /auth/google', () => {
    it('should redirect to Google OAuth', async () => {
      const response = await request(app)
        .get('/auth/google')
        .expect(302);

      expect(response.header.location).toContain('accounts.google.com/o/oauth2/v2/auth');
    });
  });

  describe('GET /auth/google/callback', () => {
    it('should handle Google OAuth callback', async () => {
      // Mock Google OAuth response
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        displayName: 'Test User',
        picture: 'https://example.com/photo.jpg'
      };

      // Test the callback endpoint
      const response = await request(app)
        .get('/auth/google/callback')
        .query({ code: 'mock-code' })
        .expect(302);

      expect(response.header.location).toContain('token=');
    });
  });
}); 