import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// 1. Todo entity — single source of truth
const UserEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
});

// 2. Server-generated fields, defined once so we omit consistently
const SERVER_FIELDS = { id: true } as const;

// 3. Derived schemas
const UserSchema = UserEntitySchema; // or .omit({ internalField: true })
const CreateUserSchema = UserSchema.omit(SERVER_FIELDS);
const UpdateUserSchema = UserSchema.omit(SERVER_FIELDS).partial();

export class UserDto extends createZodDto(UserSchema) {}
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
