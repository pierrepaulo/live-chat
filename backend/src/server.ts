import { buildServer } from './app';

const port = Number(process.env.PORT ?? 3333);
const host = process.env.HOST ?? '0.0.0.0';

const fastify = buildServer();

const start = async () => {
  try {
    await fastify.listen({ port, host });
    fastify.log.info(`HTTP+WS server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const closeGracefully = async (signal: string) => {
  fastify.log.info({ signal }, 'received shutdown signal');
  try {
    await fastify.close();
    fastify.log.info('HTTP+WS server closed cleanly');
    process.exit(0);
  } catch (error) {
    fastify.log.error({ error }, 'failed during shutdown');
    process.exit(1);
  }
};

process.on('SIGINT', () => void closeGracefully('SIGINT'));
process.on('SIGTERM', () => void closeGracefully('SIGTERM'));

void start();
