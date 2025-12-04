import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { messageCreateSchema } from '../validations';
import { createMessage, listMessages } from '../services/messageService';
import { findUserById } from '../services/userService';

const messagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const registerMessageRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/messages', async (request, reply) => {
    const parsedQuery = messagesQuerySchema.safeParse(request.query);
    if (!parsedQuery.success) {
      return reply.status(400).send({ errors: parsedQuery.error.errors });
    }

    const { limit } = parsedQuery.data;
    const messages = await listMessages(limit);
    return reply.send(messages);
  });

  fastify.post('/messages', async (request, reply) => {
    const parsed = messageCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ errors: parsed.error.errors });
    }

    const user = await findUserById(parsed.data.userId);
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    const message = await createMessage(parsed.data);
    return reply.status(201).send(message);
  });
};

export { registerMessageRoutes };
