import { z } from 'zod';
import { radarr } from '../api-client';
import { importListSchema } from '../schema';

export const putImportList = z
  .function()
  .args(z.number(), importListSchema.passthrough())
  .returns(z.promise(importListSchema))
  .implement((id, data) => {
    return radarr.patch(`/api/v3/importlist/${id}`, data);
  });
