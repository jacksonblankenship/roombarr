import { z } from 'zod';
import { radarr } from '.';
import { radarrImportListSchema } from './schema';

const fetchAllImportListsResponseSchema = z.array(radarrImportListSchema);

export type FetchAllImportListsResponse = z.infer<
  typeof fetchAllImportListsResponseSchema
>;

export async function fetchAllRadarrImportLists() {
  const response = await radarr.get('/api/v3/importlist');

  return fetchAllImportListsResponseSchema.parse(response.data);
}
