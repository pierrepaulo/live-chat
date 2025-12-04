import { buildServer } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Messages routes", () => {
  const app = buildServer({ logger: false });

  afterAll(async () => {
    await app.close();
  });

  it("creates a message tied to a user", async () => {
    const user = await prisma.user.create({ data: { name: "Bob" } });

    const response = await app.inject({
      method: "POST",
      url: "/messages",
      payload: { content: "Hello world", userId: user.id },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json() as {
      id: string;
      content: string;
      userId: string;
      user: { id: string; name: string };
    };
    expect(body.content).toBe("Hello world");
    expect(body.user.id).toBe(user.id);
  });

  it("returns messages in ascending order with user data", async () => {
    const user = await prisma.user.create({ data: { name: "Carol" } });

    const first = await prisma.message.create({
      data: {
        content: "First",
        userId: user.id,
        createdAt: new Date(Date.now() - 1000),
      },
      include: { user: true },
    });
    const second = await prisma.message.create({
      data: { content: "Second", userId: user.id },
      include: { user: true },
    });

    expect(first.createdAt < second.createdAt).toBe(true);

    const response = await app.inject({ method: "GET", url: "/messages" });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Array<{
      id: string;
      content: string;
      user: { id: string };
    }>;
    expect(body).toHaveLength(2);
    expect(body[0].id).toBe(first.id);
    expect(body[1].id).toBe(second.id);
    expect(body[0].user.id).toBe(user.id);
  });

  it("rejects invalid message payload", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/messages",
      payload: { content: "", userId: "not-a-uuid" },
    });

    expect(response.statusCode).toBe(400);
  });
});
