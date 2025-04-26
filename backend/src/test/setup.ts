import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll } from '@jest/globals';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Run migrations
  execSync('npx prisma migrate deploy');
  
  // Clean database
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
}); 