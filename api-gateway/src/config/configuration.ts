import { z } from 'zod';

export const appConfigSchema = z.object({
  port: z.coerce.number().int().positive().default(3000),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  corsOrigins: z
    .string()
    .min(1)
    .default('http://localhost:5179,http://localhost:8080')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  apiPrefix: z.string().min(1).default('api'),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export function configuration(): AppConfig {
  return appConfigSchema.parse({
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    corsOrigins: process.env.CORS_ORIGINS,
    apiPrefix: process.env.API_PREFIX,
  });
}
