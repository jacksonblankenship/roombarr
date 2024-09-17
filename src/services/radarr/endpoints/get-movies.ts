import { z } from 'zod';
import { radarr } from '../api-client';
import { radarrMovieSchema } from '../schema';

export const getMovies = z
  .function()
  .returns(z.promise(z.array(radarrMovieSchema)))
  .implement(async () => {
    const response =
      await radarr.get<Array<z.infer<typeof radarrMovieSchema>>>(
        '/api/v3/movie',
      );

    return response.data;
  });
