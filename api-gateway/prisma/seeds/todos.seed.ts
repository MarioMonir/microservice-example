import type { PrismaClient } from '@prisma/client';

export async function seedTodos(prisma: PrismaClient): Promise<void> {
  await prisma.todo.deleteMany();
  await prisma.todo.createMany({
    data: [
      { title: 'Buy groceries', done: false },
      { title: 'Write tests', done: true },
      { title: 'Ship feature', done: false },
      { title: 'Review PRs', done: false },
    ],
  });
}
