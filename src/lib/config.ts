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
 * Creates a Zod schema for validating provider-specific list configurations.
 *
 * The `options` parameter allows the list provider to specify additional properties
 * that are required for its configuration.
 */
export const createProviderConfigSchema = <T extends z.Primitive, U>(
  providerId: T,
  optionsSchema: z.ZodType<U>,
) =>
  z.object({
    listProvider: z.literal(providerId),
    expiryDays: z.number().min(0).default(DEFAULT_EXPIRY_DAYS),
    expiryNoticeDays: z
      .number()
      .min(0)
      .default(DEFAULT_DAYS_BEFORE_EXPIRY_NOTICE),
    options: optionsSchema,
  });

/**
 * Defines schemas for configurations of various list providers.
 *
 * This object holds schemas for different list providers like 'mdblist',
 * specifying how to validate configurations specific to each provider.
 */
export const providerSchemas = {
  mdblist: createProviderConfigSchema(
    'mdblist',
    z.object({
      listUrl: z.string(),
    }),
  ),
} as const;

/**
 * A schema that validates configurations for a list based on the list provider.
 *
 * This schema uses a discriminated union to handle configurations for different
 * list providers and their specific requirements.
 */
const listConfigSchema = z.discriminatedUnion('listProvider', [
  providerSchemas.mdblist,
]);

/**
 * Type inferred from `listConfigSchema` representing a configuration for a list.
 */
export type ListConfig = z.infer<typeof listConfigSchema>;

/**
 * Schema for validating the entire application configuration.
 *
 * This schema validates the configuration file for the application, which
 * includes an array of list configurations.
 */
export const appConfigSchema = z.object({
  lists: z.array(listConfigSchema),
});

/**
 * Type inferred from `appConfigSchema` representing the entire application configuration.
 */
export type AppConfig = z.infer<typeof appConfigSchema>;

/**
 * Loads and validates the application configuration from a YAML file.
 *
 * Reads the configuration file, parses it from YAML, and validates it against
 * `appConfigSchema`.
 */
export async function loadConfig() {
  const data = await readFile(join(CONFIG_DIR, CONFIG_FILE), 'utf-8');
  const yaml: unknown = parse(data);
  return appConfigSchema.parse(yaml);
}
