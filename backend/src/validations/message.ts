import { z } from 'zod';

const messageCreateSchema = z.object({
  content: z.string().trim().min(1, 'Message cannot be empty').max(1000, 'Message is too long'),
  userId: z.string().uuid(),
});

const messageSchema = messageCreateSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
});

type MessageCreateInput = z.infer<typeof messageCreateSchema>;
type Message = z.infer<typeof messageSchema>;

export { messageCreateSchema, messageSchema, type MessageCreateInput, type Message };
