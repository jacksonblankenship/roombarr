import { z } from 'zod';
import { radarr } from '.';
import { radarrImportListSchema } from './schema';

const updateImportListResponseSchema = radarrImportListSchema;

export type UpdateImportListResponse = z.infer<
  typeof updateImportListResponseSchema
>;

export const updateImportListRequestSchema =
  radarrImportListSchema.passthrough();

export type UpdateImportListRequest = z.infer<
  typeof updateImportListRequestSchema
>;

export async function updateRadarrImportList(
  importListId: number,
  request: UpdateImportListRequest,
) {
  const response = await radarr.patch(
    `/api/v3/importlist/${importListId}`,
    request,
  );

  return updateImportListResponseSchema.parse(response.data);
}
