import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserProfile } from '../types/auth.types';

// Extend the Express User type
declare global {
  namespace Express {
    interface User extends UserProfile {}
  }
}

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.metadata.readonly'
      ]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user: UserProfile = {
          id: profile.id,
          email: profile.emails?.[0].value ?? '',
          displayName: profile.displayName,
          photos: profile.photos,
          accessToken,
          refreshToken
        };
        
        // Here we'll later add code to store/update user in database
        // For now, we'll just return the user object
        
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
); 