import { z } from 'zod';
import { radarr } from '../api-client';
import { radarrImportListSchema } from '../schema';

export const getImportList = z
  .function()
  .args(z.number())
  .returns(z.promise(radarrImportListSchema))
  .implement(async id => {
    const response = await radarr.get<z.infer<typeof radarrImportListSchema>>(
      `/api/v3/importlist/${id}`,
    );

    return response.data;
  });
