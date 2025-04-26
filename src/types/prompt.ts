export interface PromptResponse {
  folderId: string;
  folderPath: string[];
  action: 'create' | 'update' | 'move';
  message: string;
  status: 'success' | 'error';
} 