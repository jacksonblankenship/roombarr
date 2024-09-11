import { z } from 'zod';
import { radarr } from '.';

const updateImportListResponseSchema = z.object({
  id: z.number().min(0),
  name: z.string(),
});

export type UpdateImportListResponse = z.infer<
  typeof updateImportListResponseSchema
>;

export async function updateRadarrImportList(
  id: number,
  { tags }: { tags: number[] },
) {
  const response = await radarr.put(`/api/v3/importlist/${id}`, { tags });

  return updateImportListResponseSchema.parse(response.data);
}
