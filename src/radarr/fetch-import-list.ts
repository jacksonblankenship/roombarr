import { z } from 'zod';
import { radarr } from '.';
import { radarrImportListSchema } from './schema';

/**
 * Use `.passthrough()` to allow additional properties in the API response
 * that are not defined in the schema. This is useful for Radarr's PUT requests,
 * which require all properties to be present. By using passthrough, we avoid
 * defining every possible field and ensure only the relevant properties are validated.
 */
const fetchImportListResponseSchema = radarrImportListSchema.passthrough();

export type FetchImportListResponse = z.infer<
  typeof fetchImportListResponseSchema
>;

export async function fetchRadarrImportList(id: number) {
  const response = await radarr.get(`/api/v3/importlist/${id}`);

  return fetchImportListResponseSchema.parse(response.data);
}
