import React, { useState, useEffect } from 'react';

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  createdTime: string;
}

interface DriveTreeViewProps {
  items: DriveItem[];
  parentId?: string;
  level?: number;
}

export const DriveTreeView: React.FC<DriveTreeViewProps> = ({ 
  items, 
  parentId = 'root', 
  level = 0 
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  useEffect(() => {
    console.log(`DriveTreeView level ${level}:`, {
      totalItems: items.length,
      parentId,
      currentItems: items.filter(item => {
        if (parentId === 'root') {
          // For root level, show items that either have no parents or have parents that don't exist in our items list
          return !item.parents || item.parents.length === 0 || 
                 !item.parents.some(parentId => items.some(item => item.id === parentId));
        }
        return item.parents?.includes(parentId);
      })
    });
  }, [items, parentId, level]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Filter items for current level
  const currentItems = items.filter(item => {
    if (parentId === 'root') {
      // For root level, show items that either have no parents or have parents that don't exist in our items list
      return !item.parents || item.parents.length === 0 || 
             !item.parents.some(parentId => items.some(item => item.id === parentId));
    }
    return item.parents?.includes(parentId);
  });

  // Sort items: folders first, then files, both alphabetically
  const sortedItems = [...currentItems].sort((a, b) => {
    const aIsFolder = a.mimeType === 'application/vnd.google-apps.folder';
    const bIsFolder = b.mimeType === 'application/vnd.google-apps.folder';
    
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    
    return a.name.localeCompare(b.name);
  });

  return (
    <ul className="list-none p-0">
      {sortedItems.map(item => {
        const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
        const isExpanded = expandedFolders.has(item.id);

        return (
          <li key={item.id} className="my-1">
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
              style={{ marginLeft: `${level * 1.5}rem` }}
              onClick={() => isFolder && toggleFolder(item.id)}
            >
              <span className="mr-2">
                {isFolder ? '📁' : '📄'}
              </span>
              <span className="flex-1">{item.name}</span>
              {isFolder && (
                <span className="text-gray-500">
                  {isExpanded ? '▼' : '▶'}
                </span>
              )}
            </div>
            {isFolder && isExpanded && (
              <DriveTreeView 
                items={items} 
                parentId={item.id} 
                level={level + 1} 
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}; 