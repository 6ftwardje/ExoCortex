export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

export interface DriveFolder extends DriveFile {
  mimeType: 'application/vnd.google-apps.folder';
}

export interface DriveStructure {
  files: DriveFile[];
  lastUpdated: Date;
}

export interface DriveCacheData {
  files: DriveFile[];
  lastUpdated: string | number;
} 