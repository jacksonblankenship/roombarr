import { z } from 'zod';
import { radarr } from '../lib/radarr';

const radarrTagResponseSchema = z.object({
  id: z.number().min(0),
  label: z.string(),
});

export async function createNewRadarrTag(label: string) {
  const response = await radarr.post('/api/v3/tag', { label });

  return radarrTagResponseSchema.parse(response.data);
}
