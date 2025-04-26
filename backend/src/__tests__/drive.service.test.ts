import { DriveService } from '../services/drive.service';
import { google } from 'googleapis';
import { UserProfile } from '../types/auth.types';
import { DriveCacheService } from '../services/drive-cache.service';

jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn(() => ({
        setCredentials: jest.fn()
      }))
    },
    drive: jest.fn()
  }
}));
jest.mock('../services/drive-cache.service');

describe('Drive Service', () => {
  let driveService: DriveService;
  let mockDrive: jest.Mock;
  
  const mockUser: UserProfile = {
    id: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    accessToken: 'test-access-token'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock DriveCacheService
    (DriveCacheService as jest.Mock).mockImplementation(() => ({
      getDriveStructure: jest.fn().mockResolvedValue(null),
      saveDriveStructure: jest.fn().mockResolvedValue(undefined),
      clearDriveStructure: jest.fn().mockResolvedValue(undefined)
    }));

    // Mock Google Drive API
    mockDrive = jest.fn();
    (google.drive as jest.Mock).mockReturnValue({
      files: {
        list: mockDrive
      }
    });

    driveService = new DriveService(mockUser);
  });

  it('should throw error if no access token is provided', () => {
    expect(() => new DriveService({ ...mockUser, accessToken: '' })).toThrow('User access token is required');
  });

  it('should list files successfully', async () => {
    const mockFiles = [
      { id: '1', name: 'test.txt', mimeType: 'text/plain' }
    ];

    mockDrive.mockResolvedValueOnce({
      data: {
        files: mockFiles
      }
    });

    const result = await driveService.listFiles();
    expect(result).toEqual(mockFiles);
  });

  it('should handle errors when listing files', async () => {
    mockDrive.mockRejectedValueOnce(new Error('API Error'));

    await expect(driveService.listFiles()).rejects.toThrow('Failed to list files from Google Drive');
  });

  it('should list folders successfully', async () => {
    const mockFolders = [
      { id: '1', name: 'test-folder', mimeType: 'application/vnd.google-apps.folder' }
    ];

    mockDrive.mockResolvedValueOnce({
      data: {
        files: mockFolders
      }
    });

    const result = await driveService.listFolders();
    expect(result).toEqual(mockFolders);
  });

  it('should handle errors when listing folders', async () => {
    mockDrive.mockRejectedValueOnce(new Error('API Error'));

    await expect(driveService.listFolders()).rejects.toThrow('Failed to list folders from Google Drive');
  });
}); 