import { resolve } from 'node:path';

const TEST_DB_PATH = resolve(__dirname, '..', '..', 'prisma', 'test.db');
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;
