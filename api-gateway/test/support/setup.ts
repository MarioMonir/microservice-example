import { execSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(__dirname, '..', '..');
const TEST_DB_PATH = resolve(PROJECT_ROOT, 'prisma', 'test.db');
const TEST_DB_URL = `file:${TEST_DB_PATH}`;

export default function globalSetup(): void {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = TEST_DB_URL;

  if (existsSync(TEST_DB_PATH)) {
    unlinkSync(TEST_DB_PATH);
  }

  execSync('pnpm prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    cwd: PROJECT_ROOT,
  });
}
