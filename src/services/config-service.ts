import { join } from 'path';
import { z } from 'zod';
import {
  DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE,
  DEFAULT_EXPIRY_DAYS,
} from '../config/defaults';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { injectable } from 'inversify';

export const configListSchema = z
  .object({
    name: z.string().min(1),
    options: z
      .object({
        expiryDays: z.number().min(0).optional().default(DEFAULT_EXPIRY_DAYS),
        expiryNoticeDays: z
          .number()
          .min(0)
          .optional()
          .default(DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE),
      })
      .optional()
      .default({
        expiryDays: DEFAULT_EXPIRY_DAYS,
        expiryNoticeDays: DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE,
      }),
  })
  .refine(val => val.options.expiryDays >= val.options.expiryNoticeDays, {
    message: 'expiryDays must be greater than or equal to expiryNoticeDays',
  });

export type ConfigList = z.input<typeof configListSchema>;

export const configSchema = z.object({
  lists: z.array(configListSchema),
});

export type Config = z.infer<typeof configSchema>;

@injectable()
export class ConfigService {
  private configPath: string;
  private config: Config | null = null;

  constructor(configDir: string, configFile: string) {
    this.configPath = join(configDir, configFile);
  }

  public async getConfig() {
    if (this.config) return this.config;

    const data = await readFile(this.configPath, 'utf-8');
    const yaml: unknown = parse(data);

    const config = configSchema.parse(yaml);
    this.config = config;

    return config;
  }
}
