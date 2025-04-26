import express from 'express';
import passport from 'passport';
import { generateToken, verifyToken } from '../middleware/auth.middleware';
import { UserProfile } from '../types/auth.types';

const router = express.Router();

// Initiate Google OAuth2 authentication
router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ]
  })
);

// Google OAuth2 callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as UserProfile;
    const token = generateToken({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      accessToken: user.accessToken
    });

    // In production, redirect to frontend with token
    // For development, return token directly
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName
      }
    });
  }
);

// Test protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'You have access to this protected route!',
    user: req.user
  });
});

export default router; 