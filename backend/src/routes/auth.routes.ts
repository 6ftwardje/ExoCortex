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
    console.log('Google callback received:', req.user);
    const user = req.user as UserProfile;
    const token = generateToken({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      accessToken: user.accessToken
    });

    console.log('Generated token:', token);
    // Set the token in a cookie and redirect to frontend
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    // Redirect to frontend dashboard
    res.redirect(`http://localhost:3002/dashboard`);
  }
);

// Get current user
router.get('/me', verifyToken, (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  res.json(req.user);
});

// Logout endpoint
router.post('/logout', verifyToken, (req, res) => {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
});

// Test protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'You have access to this protected route!',
    user: req.user
  });
});

export default router; 