import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import { createTestApp, resetDatabase } from '../support/test-app';

const BASE = '/api/v1/users';

describe('Users (e2e)', () => {
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
      .send({ name: 'Alice' });
    expect(createRes.status).toBe(201);
    expect(createRes.body).toMatchObject({
      id: expect.any(String),
      name: 'Alice',
    });
    const id = createRes.body.id as string;

    const patchRes = await request(app.getHttpServer())
      .patch(`${BASE}/${id}`)
      .send({ name: 'Alicia' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body).toEqual({ id, name: 'Alicia' });

    const delRes = await request(app.getHttpServer()).delete(`${BASE}/${id}`);
    expect(delRes.status).toBe(204);

    const listAfterDelete = await request(app.getHttpServer()).get(BASE);
    expect(listAfterDelete.body).toEqual([]);
  });

  it('POST rejects body with empty name', async () => {
    const res = await request(app.getHttpServer())
      .post(BASE)
      .send({ name: '' });
    expect(res.status).toBe(400);
  });

  it('PATCH with a non-UUID param returns 400', async () => {
    const res = await request(app.getHttpServer())
      .patch(`${BASE}/not-a-uuid`)
      .send({ name: 'X' });
    expect(res.status).toBe(400);
  });

  it('PATCH on a missing id returns 404', async () => {
    const missing = '00000000-0000-4000-8000-000000000000';
    const res = await request(app.getHttpServer())
      .patch(`${BASE}/${missing}`)
      .send({ name: 'X' });
    expect(res.status).toBe(404);
  });

  it('DELETE on a missing id returns 204 (idempotent)', async () => {
    const missing = '00000000-0000-4000-8000-000000000000';
    const res = await request(app.getHttpServer()).delete(`${BASE}/${missing}`);
    expect(res.status).toBe(204);
  });
});
