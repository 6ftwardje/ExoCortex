import { jest } from '@jest/globals';
import { mocks } from '../test-utils/firebase-mock';
import { CollectionReference, DocumentReference } from 'firebase-admin/firestore';

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue(mocks.firestore),
}));

describe('Firestore Mock Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('collection operations', async () => {
    const collection = mocks.collection as unknown as CollectionReference;
    const doc = collection.doc('123') as unknown as DocumentReference;

    // Test document set
    await doc.set({ name: 'Test' });
    expect(mocks.document.set).toHaveBeenCalledWith({ name: 'Test' });

    // Test document get
    await doc.get();
    expect(mocks.document.get).toHaveBeenCalled();

    // Test document update
    await doc.update({ name: 'Updated Test' });
    expect(mocks.document.update).toHaveBeenCalledWith({ name: 'Updated Test' });

    // Test document delete
    await doc.delete();
    expect(mocks.document.delete).toHaveBeenCalled();
  });

  test('query operations', async () => {
    const collection = mocks.collection as unknown as CollectionReference;

    // Test where clause
    collection.where('name', '==', 'Test');
    expect(mocks.collection.where).toHaveBeenCalledWith('name', '==', 'Test');

    // Test orderBy
    collection.orderBy('name', 'desc');
    expect(mocks.collection.orderBy).toHaveBeenCalledWith('name', 'desc');

    // Test limit
    collection.limit(10);
    expect(mocks.collection.limit).toHaveBeenCalledWith(10);

    // Test get
    await collection.where('name', '==', 'Test').get();
    expect(mocks.query.get).toHaveBeenCalled();
  });
}); 