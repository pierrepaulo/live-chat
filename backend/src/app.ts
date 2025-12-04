import dotenv from 'dotenv';
import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './lib/prisma';
import { registerUserRoutes } from './routes/users';
import { registerMessageRoutes } from './routes/messages';
import { registerMessageSocket } from './sockets/messages';

dotenv.config();

type BuildOptions = {
  logger?: boolean;
};

const buildServer = (options: BuildOptions = {}): FastifyInstance => {
  const fastify = Fastify({ logger: options.logger ?? true });

  void fastify.register(cors, { origin: '*' });

  const io = new SocketIOServer(fastify.server, {
    cors: { origin: '*' },
  });

  registerMessageSocket(io, fastify);

  fastify.get('/health', async () => ({ status: 'ok' }));
  void fastify.register(registerUserRoutes);
  void fastify.register(registerMessageRoutes);

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error({ err: error, url: request.url, body: request.body }, 'request error');
    return reply.status(500).send({ message: 'Internal Server Error' });
  });

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
    io.close();
  });

  return fastify;
};

export { buildServer };
