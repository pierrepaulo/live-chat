import { z } from 'zod';

const userCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name is too long'),
});

const userSchema = userCreateSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
});

type UserCreateInput = z.infer<typeof userCreateSchema>;
type User = z.infer<typeof userSchema>;

export { userCreateSchema, userSchema, type UserCreateInput, type User };
