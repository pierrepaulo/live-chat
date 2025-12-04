import { prisma } from '../lib/prisma';
import type { MessageCreateInput } from '../validations';

const createMessage = (data: MessageCreateInput) => {
  return prisma.message.create({
    data,
    include: { user: true },
  });
};

const listMessages = (limit: number) => {
  return prisma.message.findMany({
    orderBy: { createdAt: 'asc' },
    include: { user: true },
    take: limit,
  });
};

export { createMessage, listMessages };
