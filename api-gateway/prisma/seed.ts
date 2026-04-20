import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { seedTodos } from './seeds/todos.seed';
import { seedUsers } from './seeds/users.seed';

process.loadEnvFile('.env');

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
});

async function main(): Promise<void> {
  await seedUsers(prisma);
  await seedTodos(prisma);
  console.log('✔ Seeded database');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
