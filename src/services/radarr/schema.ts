import { z } from 'zod';

export const movieSchema = z.object({
  id: z.number().min(0),
  title: z.string(),
  overview: z.string(),
  year: z.number().min(0),
  imdbId: z.string().regex(/^tt\d+$/),
  added: z.coerce.date(),
  tags: z.array(z.number()),
  images: z.array(z.object({ remoteUrl: z.string() })),
});

export const importListSchema = z.object({
  id: z.number().min(0),
  name: z.string(),
  tags: z.array(z.number()),
});

export const importListMovieSchema = z.object({
  imdbId: z.string().regex(/^tt\d+$/),
  lists: z.array(z.number()),
});

export const tagSchema = z.object({
  id: z.number().min(0),
  label: z.string(),
});
