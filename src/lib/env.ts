import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),
  OUTLINE_API_URL: z.string().url({ message: 'OUTLINE_API_URL must be a valid URL' }),
  OUTLINE_FINGERPRINT: z.string().min(1, 'OUTLINE_FINGERPRINT is required'),
  HOST_IP: z.string().optional(),
  API_KEY: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);

export default env;
