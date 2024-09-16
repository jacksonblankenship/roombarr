import { z } from 'zod';
import { radarr } from '../api-client';
import { movieSchema } from '../schema';

export const getMovies = z
  .function()
  .args(z.void())
  .returns(z.promise(z.array(movieSchema)))
  .implement(() => {
    return radarr.get('/api/v3/movie');
  });
