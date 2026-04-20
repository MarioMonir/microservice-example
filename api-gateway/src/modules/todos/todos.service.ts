import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TodoDto,
  CreateTodoDto,
  UpdateTodoDto,
} from '@/modules/todos/todos.schema';
import {
  TodosRepository,
  TODOS_REPOSITORY,
} from '@/modules/todos/todos.repository';

@Injectable()
export class TodosService {
  constructor(
    @Inject(TODOS_REPOSITORY)
    private readonly repo: TodosRepository,
  ) {}

  list(): Promise<TodoDto[]> {
    return this.repo.list();
  }

  create(dto: CreateTodoDto): Promise<TodoDto> {
    return this.repo.create(dto);
  }

  async update(id: string, dto: UpdateTodoDto): Promise<TodoDto> {
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException(`todo ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const removed = await this.repo.delete(id);
    if (!removed) throw new NotFoundException(`todo ${id} not found`);
    return removed;
  }
}
