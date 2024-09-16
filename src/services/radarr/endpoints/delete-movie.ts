import { z } from 'zod';
import { radarr } from '../api-client';

export const deleteMovie = z
  .function()
  .args(z.number())
  .returns(z.promise(z.void()))
  .implement(async id => {
    await radarr.delete(`/api/v3/movie/${id}`);
  });
