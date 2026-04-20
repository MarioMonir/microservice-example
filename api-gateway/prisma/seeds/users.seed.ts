import type { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
  });
}
