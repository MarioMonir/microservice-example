import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from '@/modules/todos/todos.service';
import {
  TODOS_REPOSITORY,
  type ITodosRepository,
} from '@/modules/todos/todos.repository';
import type { TodoDto } from '@/modules/todos/todos.schema';

const TODO: TodoDto = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'write tests',
  done: false,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('TodosService', () => {
  let service: TodosService;
  let repo: jest.Mocked<ITodosRepository>;

  beforeEach(async () => {
    repo = {
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService, { provide: TODOS_REPOSITORY, useValue: repo }],
    }).compile();

    service = module.get(TodosService);
  });

  it('list returns rows from the repository', async () => {
    repo.list.mockResolvedValue([TODO]);
    await expect(service.list()).resolves.toEqual([TODO]);
    expect(repo.list).toHaveBeenCalledTimes(1);
  });

  it('create delegates to the repository', async () => {
    repo.create.mockResolvedValue(TODO);
    const dto = { title: 'write tests', done: false };
    await expect(service.create(dto)).resolves.toEqual(TODO);
    expect(repo.create).toHaveBeenCalledWith(dto);
  });

  describe('update', () => {
    it('returns the updated entity', async () => {
      const updated = { ...TODO, done: true };
      repo.update.mockResolvedValue(updated);
      await expect(service.update(TODO.id, { done: true })).resolves.toEqual(
        updated,
      );
    });

    it('throws NotFoundException when repository returns null', async () => {
      repo.update.mockResolvedValue(null);
      await expect(
        service.update(TODO.id, { done: true }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('delete', () => {
    it('returns true when the repository deletes the row', async () => {
      repo.delete.mockResolvedValue(true);
      await expect(service.delete(TODO.id)).resolves.toBe(true);
    });

    it('throws NotFoundException when nothing was deleted', async () => {
      repo.delete.mockResolvedValue(false);
      await expect(service.delete(TODO.id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
