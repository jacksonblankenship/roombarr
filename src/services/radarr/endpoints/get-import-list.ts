import { z } from 'zod';
import { radarr } from '../api-client';
import { importListSchema } from '../schema';

export const getImportList = z
  .function()
  .args(z.number())
  .returns(z.promise(importListSchema.passthrough()))
  .implement(id => {
    return radarr.get(`/api/v3/importlist/${id}`);
  });
