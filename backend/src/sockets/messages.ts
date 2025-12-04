import type { FastifyInstance } from 'fastify';
import type { Server as SocketIOServer } from 'socket.io';
import { messageCreateSchema } from '../validations';
import { findUserById } from '../services/userService';
import { createMessage } from '../services/messageService';

const registerMessageSocket = (io: SocketIOServer, fastify: FastifyInstance) => {
  io.on('connection', (socket) => {
    fastify.log.info({ socketId: socket.id }, 'socket connected');

    socket.on('chat:message', async (payload) => {
      const parsed = messageCreateSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('chat:error', { errors: parsed.error.errors });
        return;
      }

      try {
        const user = await findUserById(parsed.data.userId);
        if (!user) {
          socket.emit('chat:error', { message: 'User not found' });
          return;
        }

        const message = await createMessage(parsed.data);
        io.emit('chat:message', message);
      } catch (error) {
        fastify.log.error({ error, payload }, 'failed to handle chat message');
        socket.emit('chat:error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', (reason) => {
      fastify.log.info({ socketId: socket.id, reason }, 'socket disconnected');
    });
  });
};

export { registerMessageSocket };
