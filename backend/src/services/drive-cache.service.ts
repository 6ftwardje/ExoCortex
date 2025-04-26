import { db } from '../config/firebase';
import { DriveFile, DriveCacheData, DriveFolder } from '../types/drive.types';

export class DriveCacheService {
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly CACHE_COLLECTION = 'drive_structure';

  async getDriveStructure(userId: string): Promise<DriveFile[] | null> {
    try {
      const cacheDoc = await db
        .collection('users')
        .doc(userId)
        .collection(this.CACHE_COLLECTION)
        .doc('cache')
        .get();

      if (!cacheDoc.exists) {
        return null;
      }

      const cacheData = cacheDoc.data() as DriveCacheData;
      if (!cacheData) {
        return null;
      }

      // Check if cache is expired
      const lastUpdated = new Date(cacheData.lastUpdated);
      if (Date.now() - lastUpdated.getTime() > this.CACHE_EXPIRY) {
        return null;
      }

      return cacheData.files;
    } catch (error) {
      console.error('Error getting cached structure:', error);
      return null;
    }
  }

  async saveDriveStructure(userId: string, files: DriveFile[]): Promise<void> {
    try {
      const cacheData: DriveCacheData = {
        files,
        lastUpdated: Date.now()
      };

      await db
        .collection('users')
        .doc(userId)
        .collection(this.CACHE_COLLECTION)
        .doc('cache')
        .set(cacheData);
    } catch (error) {
      console.error('Error caching structure:', error);
      throw new Error('Failed to cache Drive structure');
    }
  }

  async clearDriveStructure(userId: string): Promise<void> {
    try {
      await db
        .collection('users')
        .doc(userId)
        .collection(this.CACHE_COLLECTION)
        .doc('cache')
        .delete();
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw new Error('Failed to clear Drive structure cache');
    }
  }

  // Helper methods for searching in cache
  async findFolderByName(userId: string, folderName: string): Promise<DriveFolder | null> {
    const files = await this.getDriveStructure(userId);
    if (!files) return null;

    return files.find(
      file => file.mimeType === 'application/vnd.google-apps.folder' && file.name === folderName
    ) as DriveFolder || null;
  }

  async findFilesByParent(userId: string, parentId: string): Promise<DriveFile[]> {
    const files = await this.getDriveStructure(userId);
    if (!files) return [];

    return files.filter(file => file.parents?.includes(parentId));
  }

  async findFilesByType(userId: string, mimeType: string): Promise<DriveFile[]> {
    const files = await this.getDriveStructure(userId);
    if (!files) return [];

    return files.filter(file => file.mimeType === mimeType);
  }

  async findFilesByDate(userId: string, startDate: Date, endDate: Date): Promise<DriveFile[]> {
    const files = await this.getDriveStructure(userId);
    if (!files) return [];

    return files.filter(file => {
      if (!file.createdTime) return false;
      const createdDate = new Date(file.createdTime);
      return createdDate >= startDate && createdDate <= endDate;
    });
  }

  async getFolderPath(userId: string, folderId: string): Promise<string[]> {
    const files = await this.getDriveStructure(userId);
    if (!files) return [];

    const path: string[] = [];
    let currentId = folderId;

    while (currentId) {
      const currentFolder = files.find(file => file.id === currentId);
      if (!currentFolder) break;

      path.unshift(currentFolder.name);
      currentId = currentFolder.parents?.[0] || '';
    }

    return path;
  }
} 