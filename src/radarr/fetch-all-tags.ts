import { z } from 'zod';
import { radarr } from '.';

const fetchAllTagsResponseSchema = z.array(
  z.object({
    id: z.number().min(0),
    label: z.string(),
  }),
);

export type FetchAllTagsResponse = z.infer<typeof fetchAllTagsResponseSchema>;

export async function fetchAllRadarrTags() {
  const response = await radarr.get('/api/v3/tag');

  return fetchAllTagsResponseSchema.parse(response.data);
}
