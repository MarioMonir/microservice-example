import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import type { App } from 'supertest/types';
import { createTestApp } from '../support/test-app';

describe('Ping (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/ping returns a pong message', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: expect.stringMatching(
        /^pong at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      ),
    });
  });
});
