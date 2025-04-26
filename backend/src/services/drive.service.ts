import { google } from 'googleapis';
import { UserProfile } from '../types/auth.types';
import { DriveFile, DriveFolder } from '../types/drive.types';
import { DriveCacheService } from './drive-cache.service';

interface DriveError extends Error {
  code?: number;
}

export class DriveService {
  private drive;
  private cacheService: DriveCacheService;
  private userId: string;

  constructor(user: UserProfile) {
    if (!user.accessToken) {
      throw new Error('User access token is required');
    }

    this.userId = user.id;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({
      access_token: user.accessToken
    });

    this.drive = google.drive({
      version: 'v3',
      auth
    });

    this.cacheService = new DriveCacheService();
  }

  async listFiles(): Promise<DriveFile[]> {
    try {
      // First try to get from cache
      const cachedFiles = await this.cacheService.getDriveStructure(this.userId);
      if (cachedFiles) {
        return cachedFiles;
      }

      // If not in cache, fetch from Drive
      const response = await this.drive.files.list({
        pageSize: 1000,
        fields: 'files(id, name, mimeType, parents, createdTime)',
      });

      if (!response.data.files) {
        return [];
      }

      const files = response.data.files.map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        parents: file.parents || [],
        createdTime: file.createdTime!,
      }));

      // Cache the results
      await this.cacheService.saveDriveStructure(this.userId, files);

      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      const driveError = error as DriveError;
      if (driveError.code === 7) {
        throw new Error('Firestore API is not enabled. Please enable it in the Google Cloud Console.');
      }
      throw new Error('Failed to list files from Google Drive');
    }
  }

  async listFolders(): Promise<DriveFolder[]> {
    try {
      const files = await this.listFiles();
      return files.filter(file => file.mimeType === 'application/vnd.google-apps.folder') as DriveFolder[];
    } catch (error) {
      console.error('Error listing folders:', error);
      throw new Error('Failed to list folders from Google Drive');
    }
  }

  async getFileDetails(fileId: string): Promise<DriveFile> {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, parents, createdTime',
      });

      const file = response.data;
      return {
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        parents: file.parents || [],
        createdTime: file.createdTime!,
      };
    } catch (error) {
      console.error('Error getting file details:', error);
      throw new Error('Failed to get file details from Google Drive');
    }
  }

  async clearCache(): Promise<void> {
    try {
      await this.cacheService.clearDriveStructure(this.userId);
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw new Error('Failed to clear Drive cache');
    }
  }
} 