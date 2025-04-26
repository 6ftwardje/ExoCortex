import express, { Response } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { PromptService } from '../services/prompt.service';
import { DriveCacheService } from '../services/drive-cache.service';
import { AuthenticatedRequest } from '../types/auth.types';

const router = express.Router();
const cacheService = new DriveCacheService();
const promptService = new PromptService(cacheService);

// Execute prompt
router.post('/execute', verifyToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ message: 'Prompt is required' });
      return;
    }

    const result = await promptService.executePrompt(req.user.id, prompt);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/prompt/execute:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to execute prompt' });
    }
  }
});

export default router; 