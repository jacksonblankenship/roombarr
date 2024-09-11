import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import {
  DEFAULT_CRON_SCHEDULE,
  DEFAULT_LOG_LEVEL,
  DEFAULT_RADARR_PORT,
} from './defaults';

export const env = createEnv({
  server: {
    RADARR_BASE_URL: z.string().url(),
    RADARR_PORT: z.coerce
      .number()
      .int()
      .min(0)
      .max(0xffff)
      .default(DEFAULT_RADARR_PORT),
    RADARR_API_KEY: z.string().min(1),
    DISCORD_WEBHOOK_URL: z
      .string()
      .url()
      .startsWith('https://discord.com/api/webhooks/')
      .optional(),
    CRON_SCHEDULE: z.string().default(DEFAULT_CRON_SCHEDULE),
    LOG_LEVEL: z.enum(['info', 'debug']).default(DEFAULT_LOG_LEVEL),
  },
  runtimeEnv: process.env,
});
