import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

beforeEach(async () => {
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
