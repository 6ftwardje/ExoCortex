import { google } from 'googleapis';
import { UserProfile } from '../types/auth.types';
import { DriveFile, DriveFolder } from '../types/drive.types';
import { DriveCacheService } from './drive-cache.service';

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
      // Try to get from cache first
      const cachedFiles = await this.cacheService.getDriveStructure(this.userId);
      if (cachedFiles) {
        return cachedFiles;
      }

      // If not in cache, fetch from Drive API
      const response = await this.drive.files.list({
        pageSize: 100,
        fields: 'files(id, name, mimeType, parents, createdTime, modifiedTime, size, webViewLink)',
        orderBy: 'name'
      });

      const files = response.data.files as DriveFile[];

      // Cache the results
      await this.cacheService.saveDriveStructure(this.userId, files);

      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files from Google Drive');
    }
  }

  async listFolders(): Promise<DriveFolder[]> {
    try {
      // Try to get from cache first
      const cachedFiles = await this.cacheService.getDriveStructure(this.userId);
      if (cachedFiles) {
        return cachedFiles.filter(
          file => file.mimeType === 'application/vnd.google-apps.folder'
        ) as DriveFolder[];
      }

      // If not in cache, fetch from Drive API
      const response = await this.drive.files.list({
        pageSize: 100,
        fields: 'files(id, name, mimeType, parents, createdTime, modifiedTime, size, webViewLink)',
        q: "mimeType='application/vnd.google-apps.folder'",
        orderBy: 'name'
      });

      const folders = response.data.files as DriveFolder[];

      // Cache the results
      await this.cacheService.saveDriveStructure(this.userId, folders);

      return folders;
    } catch (error) {
      console.error('Error listing folders:', error);
      throw new Error('Failed to list folders from Google Drive');
    }
  }

  async getFileDetails(fileId: string): Promise<DriveFile> {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, parents, createdTime, modifiedTime, size, webViewLink'
      });

      return response.data as DriveFile;
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