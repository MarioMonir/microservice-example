import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from '@/modules/todos/todos.controller';
import { TodosService } from '@/modules/todos/todos.service';
import type { TodoDto } from '@/modules/todos/todos.schema';

const TODO: TodoDto = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'write tests',
  done: false,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('TodosController', () => {
  let controller: TodosController;
  let service: jest.Mocked<TodosService>;

  beforeEach(async () => {
    service = {
      list: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TodosService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [{ provide: TodosService, useValue: service }],
    }).compile();

    controller = module.get(TodosController);
  });

  it('list returns service result', async () => {
    service.list.mockResolvedValue([TODO]);
    await expect(controller.list()).resolves.toEqual([TODO]);
  });

  it('create forwards the DTO', async () => {
    service.create.mockResolvedValue(TODO);
    const dto = { title: 'write tests', done: false };
    await expect(controller.create(dto)).resolves.toEqual(TODO);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('update forwards id and body', async () => {
    const updated = { ...TODO, done: true };
    service.update.mockResolvedValue(updated);
    await expect(controller.update(TODO.id, { done: true })).resolves.toEqual(
      updated,
    );
    expect(service.update).toHaveBeenCalledWith(TODO.id, { done: true });
  });

  it('delete forwards id', async () => {
    service.delete.mockResolvedValue(true);
    await expect(controller.delete(TODO.id)).resolves.toBe(true);
    expect(service.delete).toHaveBeenCalledWith(TODO.id);
  });
});
