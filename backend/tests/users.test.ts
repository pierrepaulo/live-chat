import { buildServer } from '../src/app';

describe('Users routes', () => {
  const app = buildServer({ logger: false });

  afterAll(async () => {
    await app.close();
  });

  it('creates a user with valid payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: 'Alice' },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json() as { id: string; name: string; createdAt: string };
    expect(body.name).toBe('Alice');
    expect(body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('rejects empty name', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: { name: '' },
    });

    expect(response.statusCode).toBe(400);
  });
});
