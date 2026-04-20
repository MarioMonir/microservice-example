import { Module } from '@nestjs/common';
import { TodosController } from '@/modules/todos/todos.controller';
import { TodosService } from '@/modules/todos/todos.service';
import {
  TodosRepository,
  TODOS_REPOSITORY,
} from '@/modules/todos/todos.repository';

@Module({
  controllers: [TodosController],
  providers: [
    TodosService,
    { provide: TODOS_REPOSITORY, useClass: TodosRepository },
  ],
})
export class TodosModule {}
