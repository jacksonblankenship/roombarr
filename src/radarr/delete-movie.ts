import { z } from 'zod';
import { radarr } from '.';

const deleteMovieResponseSchema = z.object({
  id: z.number().min(0),
});

export type DeleteMovieResponse = z.infer<typeof deleteMovieResponseSchema>;

export async function deleteRadarrMovie(id: number) {
  const response = await radarr.delete(`/api/v3/movie/${id}`);

  return deleteMovieResponseSchema.parse(response.data);
}
