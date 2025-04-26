import { PrismaClient } from '@prisma/client';

describe('Prisma Client', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to the database', async () => {
    // This is a simple test to verify that we can connect to the database
    const result = await prisma.$queryRaw`SELECT 1`;
    expect(result).toBeDefined();
  });
}); 