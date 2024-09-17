import { z } from 'zod';
import { radarr } from '../api-client';
import { radarrTagSchema } from '../schema';

export const postTag = z
  .function()
  .args(
    z.object({
      label: z.string(),
    }),
  )
  .returns(z.promise(radarrTagSchema))
  .implement(async data => {
    const response = await radarr.post<z.infer<typeof radarrTagSchema>>(
      '/api/v3/tag',
      data,
    );

    return response.data;
  });
