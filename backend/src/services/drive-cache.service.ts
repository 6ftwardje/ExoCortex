import { Firestore } from '@google-cloud/firestore';
import { DriveFile, DriveCacheData, DriveFolder } from '../types/drive.types';

interface FirestoreError extends Error {
  code?: number;
}

export class DriveCacheService {
  private firestore: Firestore;
  private collection: string;
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor() {
    this.firestore = new Firestore();
    this.collection = 'drive_cache';
  }

  async getDriveStructure(userId: string): Promise<DriveFile[] | null> {
    try {
      const docRef = this.firestore.collection(this.collection).doc(userId);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      if (!data) {
        return null;
      }

      // Check if cache is expired
      const lastUpdated = new Date(data.lastUpdated);
      if (Date.now() - lastUpdated.getTime() > this.CACHE_EXPIRY) {
        return null;
      }

      return data.files;
    } catch (error) {
      console.error('Error getting cached structure:', error);
      const firestoreError = error as FirestoreError;
      if (firestoreError.code === 5) {
        throw new Error('Firestore database is not initialized. Please initialize it in the Google Cloud Console.');
      }
      if (firestoreError.code === 7) {
        throw new Error('Firestore API is not enabled. Please enable it in the Google Cloud Console.');
      }
      throw new Error('Failed to get cached Drive structure');
    }
  }

  async saveDriveStructure(userId: string, files: DriveFile[]): Promise<void> {
    try {
      const cacheData: DriveCacheData = {
        files,
        lastUpdated: Date.now()
      };

      const docRef = this.firestore.collection(this.collection).doc(userId);
      await docRef.set(cacheData);
    } catch (error) {
      console.error('Error caching structure:', error);
      const firestoreError = error as FirestoreError;
      if (firestoreError.code === 5) {
        throw new Error('Firestore database is not initialized. Please initialize it in the Google Cloud Console.');
      }
      if (firestoreError.code === 7) {
        throw new Error('Firestore API is not enabled. Please enable it in the Google Cloud Console.');
      }
      throw new Error('Failed to cache Drive structure');
    }
  }

  async clearDriveStructure(userId: string): Promise<void> {
    try {
      const docRef = this.firestore.collection(this.collection).doc(userId);
      await docRef.delete();
    } catch (error) {
      console.error('Error clearing cache:', error);
      const firestoreError = error as FirestoreError;
      if (firestoreError.code === 5) {
        throw new Error('Firestore database is not initialized. Please initialize it in the Google Cloud Console.');
      }
      if (firestoreError.code === 7) {
        throw new Error('Firestore API is not enabled. Please enable it in the Google Cloud Console.');
      }
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