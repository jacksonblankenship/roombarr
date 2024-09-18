import { z } from 'zod';

export const radarrMovieSchema = z
  .object({
    id: z.number().min(0),
    title: z.string(),
    overview: z.string(),
    year: z.number().min(0),
    imdbId: z.string().regex(/^tt\d+$/),
    added: z.coerce.date(),
    tags: z.array(z.number()),
    images: z.array(z.object({ remoteUrl: z.string() })),
  })
  .passthrough();

export type RadarrMovie = z.infer<typeof radarrMovieSchema>;

export const radarrImportListSchema = z
  .object({
    id: z.number().min(0),
    name: z.string(),
    tags: z.array(z.number()),
  })
  .passthrough();

export type RadarrImportList = z.infer<typeof radarrImportListSchema>;

export const radarrTagSchema = z
  .object({
    id: z.number().min(0),
    label: z.string(),
  })
  .passthrough();

export type RadarrTag = z.infer<typeof radarrTagSchema>;
