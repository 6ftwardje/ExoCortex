import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';

// Load environment variables
dotenv.config();

// Import routes and configurations
import './config/passport';
import authRoutes from './routes/auth.routes';
import driveRoutes from './routes/drive.routes';
import promptRoutes from './routes/prompt.routes';

// Create Express app
const app: Express = express();

// Middleware
app.use(morgan('dev')); // Logging
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api/prompt', promptRoutes);

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

export default app;
