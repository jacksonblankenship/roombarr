import { z } from 'zod';
import { radarr } from '../lib/radarr';

const radarrTagSchema = z.object({
  id: z.number().min(0),
  label: z.string(),
});

export type RadarrTag = z.infer<typeof radarrTagSchema>;

export async function fetchAllRadarrTags() {
  const response = await radarr.get('/api/v3/tag');

  return z.array(radarrTagSchema).parse(response.data);
}
