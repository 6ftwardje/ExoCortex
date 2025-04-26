import { DriveCacheService } from './drive-cache.service';
import { DriveFile } from '../types/drive.types';
import { PromptResponse } from '../types/prompt.types';

export class PromptService {
  private cacheService: DriveCacheService;

  constructor(cacheService: DriveCacheService) {
    this.cacheService = cacheService;
  }

  async executePrompt(userId: string, prompt: string): Promise<PromptResponse> {
    try {
      // Get the Drive structure
      const files = await this.cacheService.getDriveStructure(userId);
      if (!files) {
        throw new Error('Drive structure not found');
      }

      console.log('Available files:', files.map(f => ({ name: f.name, type: f.mimeType })));

      // Simple prompt parsing for now
      const lowerPrompt = prompt.toLowerCase();
      let targetFolder: DriveFile | undefined;

      // Look for folder names in the prompt
      const folders = files.filter(file => 
        file.mimeType === 'application/vnd.google-apps.folder'
      );

      console.log('Available folders:', folders.map(f => f.name));

      // Try to find a matching folder
      targetFolder = folders.find(folder => 
        lowerPrompt.includes(folder.name.toLowerCase())
      );

      // If no exact match, try partial match
      if (!targetFolder) {
        targetFolder = folders.find(folder => 
          folder.name.toLowerCase().includes('oasix') || 
          folder.name.toLowerCase().includes('meeting')
        );
      }

      if (!targetFolder) {
        throw new Error('Could not find a matching folder for your prompt. Available folders: ' + 
          folders.map(f => f.name).join(', '));
      }

      // Get the folder path
      const folderPath = await this.cacheService.getFolderPath(userId, targetFolder.id);

      return {
        folderId: targetFolder.id,
        folderPath,
        action: 'create',
        message: `Found folder: ${targetFolder.name}`,
        status: 'success'
      };
    } catch (error) {
      console.error('Error executing prompt:', error);
      throw error;
    }
  }
} 