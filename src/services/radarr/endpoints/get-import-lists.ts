import { z } from 'zod';
import { radarr } from '../api-client';
import { importListSchema } from '../schema';

export const getImportLists = z
  .function()
  .args(z.void())
  .returns(z.promise(z.array(importListSchema)))
  .implement(() => {
    return radarr.get('/api/v3/importlist');
  });
