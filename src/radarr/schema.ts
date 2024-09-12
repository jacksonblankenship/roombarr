import { z } from 'zod';

export const radarrMovieSchema = z.object({
  id: z.number().min(0),
  title: z.string(),
  overview: z.string(),
  year: z.number().min(0),
  imdbId: z.string().startsWith('tt'),
  added: z.coerce.date(),
  tags: z.array(z.number()),
  images: z.array(z.object({ remoteUrl: z.string() })),
});

export const radarrImportListSchema = z.object({
  id: z.number().min(0),
  name: z.string(),
  tags: z.array(z.number()),
});
