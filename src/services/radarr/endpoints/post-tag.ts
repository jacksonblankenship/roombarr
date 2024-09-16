import { z } from 'zod';
import { radarr } from '../api-client';
import { tagSchema } from '../schema';

export const postTag = z
  .function()
  .args(
    z.object({
      label: z.string(),
    }),
  )
  .returns(z.promise(tagSchema))
  .implement(data => {
    return radarr.post('/api/v3/tag', data);
  });
