import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import {
  DEFAULT_MOVIE_EXPIRY_DAYS,
  DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE,
  DEFAULT_CRON_SCHEDULE,
  DEFAULT_LOG_LEVEL,
} from './defaults';

export const env = createEnv({
  server: {
    RADARR_URL: z.string().min(1),
    RADARR_API_KEY: z.string().min(1),
    RADARR_MDBLIST_TAG_ID: z.coerce.number().min(0),

    MDBLIST_USERNAME: z.string().min(1),
    MDBLIST_LIST_NAME: z.string().min(1),

    DISCORD_WEBHOOK_URL: z.string().url(),

    MOVIE_EXPIRY_DAYS: z.coerce
      .number()
      .min(0)
      .default(DEFAULT_MOVIE_EXPIRY_DAYS),
    DAYS_BEFORE_EXPIRY_NOTICE: z.coerce
      .number()
      .min(0)
      .default(DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE),

    CRON_SCHEDULE: z.string().default(DEFAULT_CRON_SCHEDULE),
    LOG_LEVEL: z.enum(['info', 'debug']).default(DEFAULT_LOG_LEVEL),
  },
  runtimeEnv: process.env,
});
