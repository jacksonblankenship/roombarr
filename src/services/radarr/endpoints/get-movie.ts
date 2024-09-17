import { z } from 'zod';
import { radarr } from '../api-client';
import { radarrMovieSchema } from '../schema';

export const getMovie = z
  .function()
  .args(z.number())
  .returns(z.promise(radarrMovieSchema))
  .implement(async id => {
    const response = await radarr.get<z.infer<typeof radarrMovieSchema>>(
      `/api/v3/movie/${id}`,
    );

    return response.data;
  });
