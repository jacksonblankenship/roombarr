import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { z } from 'zod';
import {
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE,
} from './defaults';
import { join } from 'path';
import { CONFIG_DIR, CONFIG_FILE } from './constants';

/**
 * Creates a Zod schema for validating a list configuration from a specific provider.
 *
 * The `options` parameter allows the list provider to define additional properties
 * that are specific to its configuration requirements.
 */
export const createListSchema = <T extends z.Primitive, U>(
  listProvider: T,
  options: z.ZodType<U>,
) =>
  z.object({
    listProvider: z.literal(listProvider),
    expiryDays: z.number().min(0).default(DEFAULT_EXPIRY_DAYS),
    expiryNoticeDays: z
      .number()
      .min(0)
      .default(DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE),
    options,
  });

/**
 * Defines schemas for various list providers.
 *
 * This object contains schemas for different list providers like 'mdblist',
 * specifying how to validate configurations for each provider.
 */
export const listProviderSchemas = {
  mdblist: createListSchema(
    'mdblist',
    z.object({
      listUrl: z.string(),
    }),
  ),
} as const;

/**
 * A schema that validates a list configuration based on the list provider.
 *
 * This schema uses a discriminated union to handle different list providers and
 * their specific configurations.
 */
const listSchema = z.discriminatedUnion('listProvider', [
  listProviderSchemas.mdblist,
]);

/**
 * Type inferred from the `listSchema` that represents a list configuration.
 */
export type List = z.infer<typeof listSchema>;

/**
 * Schema for validating the entire application configuration.
 *
 * This schema validates the configuration file for the application, which includes
 * an array of list configurations.
 */
export const appConfigSchema = z.object({
  lists: z.array(listSchema),
});

/**
 * Type inferred from the `appConfigSchema` that represents the application configuration.
 */
export type AppConfig = z.infer<typeof appConfigSchema>;

/**
 * Loads and validates the application configuration from a YAML file.
 *
 * Reads the configuration file, parses it from YAML, and validates it against the
 * `appConfigSchema`.
 */
export async function loadConfig() {
  const data = await readFile(join(CONFIG_DIR, CONFIG_FILE), 'utf-8');
  const yaml: unknown = parse(data);
  return appConfigSchema.parse(yaml);
}
