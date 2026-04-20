import { Test } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import type { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { DBService } from '@/common/db/db.service';

export async function createTestApp(): Promise<INestApplication<App>> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  await app.init();
  return app;
}

export async function resetDatabase(app: INestApplication<App>): Promise<void> {
  const db = app.get(DBService);
  await db.todo.deleteMany();
  await db.user.deleteMany();
}
