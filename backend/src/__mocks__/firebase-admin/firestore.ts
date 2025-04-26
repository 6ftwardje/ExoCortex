/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@jest/globals';

// Mock Firestore document methods
const mockDocumentMethods = {
  set: jest.fn(() => Promise.resolve()),
  get: jest.fn(() => Promise.resolve({ data: () => ({}) })),
  update: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  collection: jest.fn(() => mockCollectionMethods),
};

// Mock Firestore query methods
const mockQueryMethods = {
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  get: jest.fn(() => Promise.resolve({ docs: [] })),
};

// Mock Firestore collection methods
const mockCollectionMethods = {
  doc: jest.fn(() => mockDocumentMethods),
  where: jest.fn(() => mockQueryMethods),
  orderBy: jest.fn(() => mockQueryMethods),
  limit: jest.fn(() => mockQueryMethods),
  get: jest.fn(() => Promise.resolve({ docs: [] })),
};

// Mock Firestore instance
const mockFirestore = {
  collection: jest.fn(() => mockCollectionMethods),
};

// Export the mock
export const getFirestore = jest.fn(() => mockFirestore); 