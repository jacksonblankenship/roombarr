import { z } from 'zod';
import { radarr } from '../api-client';
import { movieSchema } from '../schema';

export const getMovie = z
  .function()
  .args(z.number())
  .returns(z.promise(movieSchema.passthrough()))
  .implement(id => {
    return radarr.get(`/api/v3/movie/${id}`);
  });
