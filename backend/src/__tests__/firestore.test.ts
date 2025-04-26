import { getFirestore } from 'firebase-admin/firestore';

jest.mock('firebase-admin/firestore');

describe('Firestore Mock Tests', () => {
  const db = getFirestore();
  const mockDoc = { id: '123', name: 'Test Document' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should mock collection operations', async () => {
    const collection = db.collection('test-collection');
    const doc = collection.doc('123');

    // Test set operation
    await doc.set(mockDoc);
    expect(doc.set).toHaveBeenCalledWith(mockDoc);

    // Test get operation
    await doc.get();
    expect(doc.get).toHaveBeenCalled();

    // Test update operation
    const updateData = { name: 'Updated Document' };
    await doc.update(updateData);
    expect(doc.update).toHaveBeenCalledWith(updateData);

    // Test delete operation
    await doc.delete();
    expect(doc.delete).toHaveBeenCalled();
  });

  test('should mock query operations', async () => {
    const collection = db.collection('test-collection');
    const whereQuery = collection.where('name', '==', 'Test');
    const orderByQuery = whereQuery.orderBy('createdAt', 'desc');
    const limitQuery = orderByQuery.limit(10);

    await limitQuery.get();

    expect(collection.where).toHaveBeenCalledWith('name', '==', 'Test');
    expect(whereQuery.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(orderByQuery.limit).toHaveBeenCalledWith(10);
    expect(limitQuery.get).toHaveBeenCalled();
  });
}); 