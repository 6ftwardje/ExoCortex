import { DriveCacheService } from './drive-cache.service';
import { DriveFile, DriveFolder } from '../types/drive.types';

export interface PromptResult {
  folderId: string;
  folderPath: string[];
  selectedFiles: DriveFile[];
  action: string;
}

export class PromptService {
  private cacheService: DriveCacheService;

  constructor(cacheService: DriveCacheService) {
    this.cacheService = cacheService;
  }

  async executePrompt(userId: string, prompt: string): Promise<PromptResult> {
    try {
      // Extract folder name from prompt (simple implementation)
      const folderName = this.extractFolderName(prompt);
      if (!folderName) {
        throw new Error('No folder name found in prompt');
      }

      // Find the folder
      const folder = await this.cacheService.findFolderByName(userId, folderName);
      if (!folder) {
        throw new Error(`Folder "${folderName}" not found`);
      }

      // Get folder path
      const folderPath = await this.cacheService.getFolderPath(userId, folder.id);

      // Find relevant files in the folder
      const files = await this.cacheService.findFilesByParent(userId, folder.id);

      // Determine action based on prompt
      const action = this.determineAction(prompt);

      return {
        folderId: folder.id,
        folderPath,
        selectedFiles: files,
        action
      };
    } catch (error) {
      console.error('Error executing prompt:', error);
      throw error;
    }
  }

  private extractFolderName(prompt: string): string | null {
    // Simple implementation - look for folder name after "for" or "in"
    const match = prompt.match(/(?:for|in)\s+([A-Za-z0-9\s]+)/i);
    return match ? match[1].trim() : null;
  }

  private determineAction(prompt: string): string {
    // Simple implementation - determine action based on keywords
    if (prompt.toLowerCase().includes('meeting notes')) {
      return 'process_meeting_notes';
    } else if (prompt.toLowerCase().includes('summarize')) {
      return 'summarize_documents';
    } else if (prompt.toLowerCase().includes('improve')) {
      return 'improve_text';
    }
    return 'process_documents';
  }
} 