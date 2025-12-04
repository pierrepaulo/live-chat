import type { FastifyInstance } from 'fastify';
import { userCreateSchema } from '../validations';
import { createUser } from '../services/userService';

const registerUserRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/users', async (request, reply) => {
    const parsed = userCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ errors: parsed.error.errors });
    }

    const user = await createUser(parsed.data);
    return reply.status(201).send(user);
  });
};

export { registerUserRoutes };
