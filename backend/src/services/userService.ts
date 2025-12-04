import { prisma } from '../lib/prisma';
import type { UserCreateInput } from '../validations';

const createUser = (data: UserCreateInput) => {
  return prisma.user.create({ data });
};

const findUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export { createUser, findUserById };
