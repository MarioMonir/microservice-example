import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// 1. Todo entity — single source of truth
const TodoEntitySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  done: z.boolean(),
  createdAt: z.date(),
});

// 2. Server-generated fields, defined once so we omit consistently
const SERVER_FIELDS = {
  id: true,
  createdAt: true,
} as const;

// 3. Derived schemas
const TodoSchema = TodoEntitySchema; // or .omit({ internalField: true })
const CreateTodoSchema = TodoSchema.omit(SERVER_FIELDS).extend({
  done: TodoSchema.shape.done.default(false),
});
const UpdateTodoSchema = TodoSchema.omit(SERVER_FIELDS).partial();

export class TodoDto extends createZodDto(TodoSchema) {}
export class CreateTodoDto extends createZodDto(CreateTodoSchema) {}
export class UpdateTodoDto extends createZodDto(UpdateTodoSchema) {}
