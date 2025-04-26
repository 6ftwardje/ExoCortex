import express, { Response } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { DriveService } from '../services/drive.service';
import { AuthenticatedRequest } from '../types/auth.types';

const router = express.Router();

// List all files
router.get('/list', verifyToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const driveService = new DriveService(req.user);
    const files = await driveService.listFiles();
    res.json(files);
  } catch (error) {
    console.error('Error in /api/drive/list:', error);
    res.status(500).json({ message: 'Failed to list files' });
  }
});

// List all folders
router.get('/folders', verifyToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const driveService = new DriveService(req.user);
    const folders = await driveService.listFolders();
    res.json(folders);
  } catch (error) {
    console.error('Error in /api/drive/folders:', error);
    res.status(500).json({ message: 'Failed to list folders' });
  }
});

// Get file details
router.get('/files/:fileId', verifyToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { fileId } = req.params;
    const driveService = new DriveService(req.user);
    const fileDetails = await driveService.getFileDetails(fileId);
    res.json(fileDetails);
  } catch (error) {
    console.error('Error in /api/drive/files/:fileId:', error);
    res.status(500).json({ message: 'Failed to get file details' });
  }
});

// Clear cache
router.post('/clear-cache', verifyToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const driveService = new DriveService(req.user);
    await driveService.clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error in /api/drive/clear-cache:', error);
    res.status(500).json({ message: 'Failed to clear cache' });
  }
});

export default router; 