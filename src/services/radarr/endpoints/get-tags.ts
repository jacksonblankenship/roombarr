import { z } from 'zod';
import { radarr } from '../api-client';
import { tagSchema } from '../schema';

export const getTags = z
  .function()
  .args(z.void())
  .returns(z.promise(z.array(tagSchema)))
  .implement(() => {
    return radarr.get('/api/v3/tag');
  });
