import { z } from 'zod';
import { radarr } from '.';

const fetchAllImportListsResponseSchema = z.array(
  z.object({
    id: z.number().min(0),
    name: z.string(),
    tags: z.array(z.number()),
  }),
);

export type FetchAllImportListsResponse = z.infer<
  typeof fetchAllImportListsResponseSchema
>;

export async function fetchAllRadarrImportLists() {
  const response = await radarr.get('/api/v3/importlist');

  return fetchAllImportListsResponseSchema.parse(response.data);
}
