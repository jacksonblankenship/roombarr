import { z } from 'zod';
import { radarr } from '../api-client';
import { radarrMovieSchema } from '../schema';

export const getImportListMovies = z
  .function()
  .returns(z.promise(z.array(radarrMovieSchema)))
  .implement(async () => {
    const response = await radarr.get<Array<z.infer<typeof radarrMovieSchema>>>(
      '/api/v3/importlist/movie',
    );

    return response.data;
  });
