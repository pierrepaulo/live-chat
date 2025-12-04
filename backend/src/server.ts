import dotenv from "dotenv";
import Fastify from "fastify";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./lib/prisma";
import { messageCreateSchema, userCreateSchema } from "./validations";

dotenv.config();

const fastify = Fastify({ logger: true });

const io = new SocketIOServer(fastify.server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  fastify.log.info({ socketId: socket.id }, "socket connected");

  socket.on("chat:message", (payload) => {
    // TODO: integrar o fluxo de mensagens persistentes com socckets
    io.emit("chat:message", payload);
  });

  socket.on("disconnect", (reason) => {
    fastify.log.info({ socketId: socket.id, reason }, "socket disconnected");
  });
});

fastify.get("/health", async () => ({ status: "ok" }));

fastify.post("/users", async (request, reply) => {
  const parsed = userCreateSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ errors: parsed.error.errors });
  }

  const user = await prisma.user.create({
    data: parsed.data,
  });

  return reply.status(201).send(user);
});

fastify.get("/messages", async (_request, reply) => {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "asc" },
    include: { user: true },
  });

  return reply.send(messages);
});

fastify.post("/messages", async (request, reply) => {
  const parsed = messageCreateSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ errors: parsed.error.errors });
  }

  const message = await prisma.message.create({
    data: parsed.data,
    include: { user: true },
  });

  return reply.status(201).send(message);
});

const port = Number(process.env.PORT ?? 3333);
const host = process.env.HOST ?? "0.0.0.0";

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
