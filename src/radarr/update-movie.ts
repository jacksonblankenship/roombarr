import { z } from 'zod';
import { radarr } from '.';

const updateMovieResponseSchema = z.object({
  id: z.number().min(0),
});

export type UpdateMovieResponse = z.infer<typeof updateMovieResponseSchema>;

export async function updateRadarrMovie(
  id: number,
  { tags }: { tags: number[] },
) {
  const response = await radarr.put(`/api/v3/movie/${id}`, { tags });

  return updateMovieResponseSchema.parse(response.data);
}
