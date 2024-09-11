import { z } from 'zod';
import { radarr } from '.';

const createTagResponseSchema = z.object({
  id: z.number().min(0),
  label: z.string(),
});

export type CreateTagResponse = z.infer<typeof createTagResponseSchema>;

export async function createRadarrTag(label: string) {
  const response = await radarr.post('/api/v3/tag', { label });

  return createTagResponseSchema.parse(response.data);
}
