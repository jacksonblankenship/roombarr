import { z } from 'zod';
import { radarr } from '../api-client';
import { radarrImportListSchema } from '../schema';

export const putImportList = z
  .function()
  .args(z.number(), radarrImportListSchema)
  .returns(z.promise(radarrImportListSchema))
  .implement(async (id, data) => {
    const response = await radarr.put<z.infer<typeof radarrImportListSchema>>(
      `/api/v3/importlist/${id}`,
      data,
    );

    return response.data;
  });
