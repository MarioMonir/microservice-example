import { Injectable } from '@nestjs/common';
import { DBService } from '@/common/db/db.service';
import { isNotFound } from '@/common/errors/common.errors';
import {
  CreateTodoDto,
  TodoDto,
  UpdateTodoDto,
} from '@/modules/todos/todos.schema';

export const TODOS_REPOSITORY = Symbol('TODOS_REPOSITORY');

export interface ITodosRepository {
  list(): Promise<TodoDto[]>;
  create(data: CreateTodoDto): Promise<TodoDto>;
  update(id: string, patch: UpdateTodoDto): Promise<TodoDto | null>;
  delete(id: string): Promise<boolean>;
}

@Injectable()
export class TodosRepository implements ITodosRepository {
  constructor(private readonly db: DBService) {}

  list(): Promise<TodoDto[]> {
    return this.db.todo.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(data: CreateTodoDto): Promise<TodoDto> {
    return this.db.todo.create({ data });
  }

  async update(id: string, patch: UpdateTodoDto): Promise<TodoDto | null> {
    try {
      return await this.db.todo.update({ where: { id }, data: patch });
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.todo.delete({ where: { id } });
      return true;
    } catch (err) {
      if (isNotFound(err)) return false;
      throw err;
    }
  }
}
