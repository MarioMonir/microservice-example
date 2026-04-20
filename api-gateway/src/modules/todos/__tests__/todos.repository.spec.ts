import { Test, TestingModule } from '@nestjs/testing';
import { DBService } from '@/common/db/db.service';
import { TodosRepository } from '@/modules/todos/todos.repository';
import type { TodoDto } from '@/modules/todos/todos.schema';

const TODO: TodoDto = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'write tests',
  done: false,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

type TodoDelegate = {
  findMany: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe('TodosRepository', () => {
  let repo: TodosRepository;
  let db: { todo: TodoDelegate };

  beforeEach(async () => {
    db = {
      todo: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosRepository, { provide: DBService, useValue: db }],
    }).compile();

    repo = module.get(TodosRepository);
  });

  it('list orders by createdAt desc', async () => {
    db.todo.findMany.mockResolvedValue([TODO]);
    await expect(repo.list()).resolves.toEqual([TODO]);
    expect(db.todo.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('create passes data through', async () => {
    db.todo.create.mockResolvedValue(TODO);
    const dto = { title: 'write tests', done: false };
    await expect(repo.create(dto)).resolves.toEqual(TODO);
    expect(db.todo.create).toHaveBeenCalledWith({ data: dto });
  });

  describe('update', () => {
    it('returns the updated row', async () => {
      const updated = { ...TODO, done: true };
      db.todo.update.mockResolvedValue(updated);
      await expect(repo.update(TODO.id, { done: true })).resolves.toEqual(
        updated,
      );
      expect(db.todo.update).toHaveBeenCalledWith({
        where: { id: TODO.id },
        data: { done: true },
      });
    });

    it('returns null when Prisma throws P2025', async () => {
      db.todo.update.mockRejectedValue({ code: 'P2025' });
      await expect(repo.update(TODO.id, { done: true })).resolves.toBeNull();
    });

    it('rethrows any other error', async () => {
      const boom = new Error('boom');
      db.todo.update.mockRejectedValue(boom);
      await expect(repo.update(TODO.id, { done: true })).rejects.toBe(boom);
    });
  });

  describe('delete', () => {
    it('returns true on success', async () => {
      db.todo.delete.mockResolvedValue(undefined);
      await expect(repo.delete(TODO.id)).resolves.toBe(true);
      expect(db.todo.delete).toHaveBeenCalledWith({
        where: { id: TODO.id },
      });
    });

    it('returns false on P2025', async () => {
      db.todo.delete.mockRejectedValue({ code: 'P2025' });
      await expect(repo.delete(TODO.id)).resolves.toBe(false);
    });

    it('rethrows any other error', async () => {
      const boom = new Error('boom');
      db.todo.delete.mockRejectedValue(boom);
      await expect(repo.delete(TODO.id)).rejects.toBe(boom);
    });
  });
});
