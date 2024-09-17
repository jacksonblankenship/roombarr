import { z } from 'zod';
import { radarr } from '../api-client';
import { radarrTagSchema } from '../schema';

export const getTags = z
  .function()
  .returns(z.promise(z.array(radarrTagSchema)))
  .implement(async () => {
    const response =
      await radarr.get<Array<z.infer<typeof radarrTagSchema>>>('/api/v3/tag');

    return response.data;
  });
