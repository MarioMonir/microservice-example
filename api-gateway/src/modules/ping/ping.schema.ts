import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const pingResponseSchema = z.object({
  message: z.string().min(1),
});

export class PingResponseDto extends createZodDto(pingResponseSchema) {}
