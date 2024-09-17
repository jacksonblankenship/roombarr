import { z } from 'zod';
import { radarr } from '../api-client';
import { radarrImportListSchema } from '../schema';

export const getImportLists = z
  .function()
  .returns(z.promise(z.array(radarrImportListSchema)))
  .implement(async () => {
    const response =
      await radarr.get<Array<z.infer<typeof radarrImportListSchema>>>(
        '/api/v3/importlist',
      );

    return response.data;
  });
