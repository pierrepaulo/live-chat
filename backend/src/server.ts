import dotenv from 'dotenv';
import Fastify from 'fastify';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const fastify = Fastify({ logger: true });

const io = new SocketIOServer(fastify.server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  fastify.log.info({ socketId: socket.id }, 'socket connected');

  socket.on('chat:message', (payload) => {
    io.emit('chat:message', payload);
  });

  socket.on('disconnect', (reason) => {
    fastify.log.info({ socketId: socket.id, reason }, 'socket disconnected');
  });
});

fastify.get('/health', async () => ({ status: 'ok' }));

const port = Number(process.env.PORT ?? 3333);
const host = process.env.HOST ?? '0.0.0.0';

const start = async () => {
  try {
    await fastify.listen({ port, host });
    fastify.log.info(`HTTP+WS server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
