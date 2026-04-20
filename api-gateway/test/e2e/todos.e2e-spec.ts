import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import { createTestApp, resetDatabase } from '../support/test-app';

const BASE = '/api/v1/todos';

describe('Todos (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await resetDatabase(app);
  });

  it('GET returns an empty list initially', async () => {
    const res = await request(app.getHttpServer()).get(BASE);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('full CRUD lifecycle', async () => {
    const createRes = await request(app.getHttpServer())
      .post(BASE)
      .send({ title: 'first todo' });
    expect(createRes.status).toBe(201);
    expect(createRes.body).toMatchObject({
      id: expect.any(String),
      title: 'first todo',
      done: false,
    });
    const id = createRes.body.id as string;

    const listAfterCreate = await request(app.getHttpServer()).get(BASE);
    expect(listAfterCreate.body).toHaveLength(1);

    const patchRes = await request(app.getHttpServer())
      .patch(`${BASE}/${id}`)
      .send({ done: true });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body).toMatchObject({ id, done: true });

    const delRes = await request(app.getHttpServer()).delete(`${BASE}/${id}`);
    expect(delRes.status).toBe(204);

    const listAfterDelete = await request(app.getHttpServer()).get(BASE);
    expect(listAfterDelete.body).toEqual([]);
  });

  it('list is ordered by createdAt desc', async () => {
    await request(app.getHttpServer()).post(BASE).send({ title: 'a' });
    await new Promise((r) => setTimeout(r, 5));
    await request(app.getHttpServer()).post(BASE).send({ title: 'b' });

    const res = await request(app.getHttpServer()).get(BASE);
    expect(res.body.map((t: { title: string }) => t.title)).toEqual(['b', 'a']);
  });

  it('POST rejects body with empty title (zod validation)', async () => {
    const res = await request(app.getHttpServer())
      .post(BASE)
      .send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('PATCH with a non-UUID param returns 400', async () => {
    const res = await request(app.getHttpServer())
      .patch(`${BASE}/not-a-uuid`)
      .send({ done: true });
    expect(res.status).toBe(400);
  });

  it('PATCH on a missing id returns 404', async () => {
    const missing = '00000000-0000-4000-8000-000000000000';
    const res = await request(app.getHttpServer())
      .patch(`${BASE}/${missing}`)
      .send({ done: true });
    expect(res.status).toBe(404);
  });

  it('DELETE on a missing id returns 404', async () => {
    const missing = '00000000-0000-4000-8000-000000000000';
    const res = await request(app.getHttpServer()).delete(`${BASE}/${missing}`);
    expect(res.status).toBe(404);
  });
});
