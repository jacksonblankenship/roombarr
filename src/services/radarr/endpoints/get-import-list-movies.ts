import { z } from 'zod';
import { radarr } from '../api-client';
import { importListMovieSchema } from '../schema';

export const getImportListMovies = z
  .function()
  .args(z.void())
  .returns(z.promise(z.array(importListMovieSchema)))
  .implement(() => {
    return radarr.get('/api/v3/importlist/movie');
  });
