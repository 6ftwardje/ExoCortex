import { jest } from '@jest/globals';
import { DocumentData, DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';

// Mock Timestamp
const mockTimestamp = {
  now: jest.fn().mockReturnValue({ seconds: 1234567890, nanoseconds: 0 }),
  fromDate: jest.fn(),
  fromMillis: jest.fn(),
};

const mockData: DocumentData = {
  id: '123',
  name: 'Test Document'
};

const documentMock = {
  set: jest.fn().mockReturnValue(Promise.resolve()),
  get: jest.fn().mockReturnValue(Promise.resolve({
    data: () => mockData,
    exists: true,
    id: '123',
    ref: {} as DocumentReference,
    readTime: mockTimestamp.now(),
    get: jest.fn(),
    isEqual: (other: DocumentSnapshot): boolean => other.id === '123',
  })),
  update: jest.fn().mockReturnValue(Promise.resolve()),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  collection: jest.fn().mockReturnValue({
    doc: jest.fn(),
  }),
};

const queryMock = {
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnValue(Promise.resolve({
    docs: [{
      data: () => mockData,
      exists: true,
      id: '123',
      ref: {} as DocumentReference,
      readTime: mockTimestamp.now(),
      createTime: mockTimestamp.now(),
      updateTime: mockTimestamp.now(),
      get: jest.fn(),
      isEqual: (other: DocumentSnapshot): boolean => other.id === '123',
    } as unknown as QueryDocumentSnapshot],
    empty: false,
    size: 1,
    forEach: jest.fn(),
  })),
};

const collectionMock = {
  doc: jest.fn().mockReturnValue(documentMock),
  where: jest.fn().mockReturnValue(queryMock),
  orderBy: jest.fn().mockReturnValue(queryMock),
  limit: jest.fn().mockReturnValue(queryMock),
};

export const mocks = {
  firestore: {
    collection: jest.fn().mockReturnValue(collectionMock),
  },
  document: documentMock,
  query: queryMock,
  collection: collectionMock,
}; 