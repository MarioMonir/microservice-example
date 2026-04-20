import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import { createTestApp } from '../support/test-app';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('routes are mounted under the /api prefix with /v1 versioning', async () => {
    const ok = await request(app.getHttpServer()).get('/api/v1/ping');
    expect(ok.status).toBe(200);

    const unprefixed = await request(app.getHttpServer()).get('/ping');
    expect(unprefixed.status).toBe(404);

    const unversioned = await request(app.getHttpServer()).get('/api/ping');
    expect(unversioned.status).toBe(404);
  });

  it('exposes x-request-id on responses (generated when absent)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/ping');
    expect(res.headers['x-request-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('echoes an incoming x-request-id header', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/ping')
      .set('x-request-id', 'test-req-123');
    expect(res.headers['x-request-id']).toBe('test-req-123');
  });
});
