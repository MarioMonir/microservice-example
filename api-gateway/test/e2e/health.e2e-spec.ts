import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import { createTestApp } from '../support/test-app';

describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health/live returns status ok', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/health/ready reports a memory_heap indicator', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health/ready');
    expect([200, 503]).toContain(res.status);
    expect(
      res.body.info?.memory_heap ?? res.body.error?.memory_heap,
    ).toBeDefined();
  });
});
