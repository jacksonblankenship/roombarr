import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';
import {
  radarrImportListSchema,
  radarrMovieSchema,
  radarrTagSchema,
} from './radarr-service.schema';

export class RadarrService {
  private apiClient: AxiosInstance;

  constructor(baseUrl: string, port: number, apiKey: string) {
    this.apiClient = axios.create({
      baseURL: `${baseUrl}:${port}`,
      headers: {
        'X-Api-Key': apiKey,
      },
    });
  }

  public deleteMovie = z
    .function()
    .args(z.number())
    .returns(z.promise(z.void()))
    .implement(async id => {
      await this.apiClient.delete(`/api/v3/movie/${id}`);
    });

  public getImportListMovies = z
    .function()
    .returns(z.promise(z.array(radarrMovieSchema)))
    .implement(async () => {
      const response = await this.apiClient.get<
        Array<z.infer<typeof radarrMovieSchema>>
      >('/api/v3/importlist/movie');

      return response.data;
    });

  public getImportList = z
    .function()
    .args(z.number())
    .returns(z.promise(radarrImportListSchema))
    .implement(async id => {
      const response = await this.apiClient.get<
        z.infer<typeof radarrImportListSchema>
      >(`/api/v3/importlist/${id}`);

      return response.data;
    });

  public getImportLists = z
    .function()
    .returns(z.promise(z.array(radarrImportListSchema)))
    .implement(async () => {
      const response =
        await this.apiClient.get<Array<z.infer<typeof radarrImportListSchema>>>(
          '/api/v3/importlist',
        );

      return response.data;
    });

  public getMovie = z
    .function()
    .args(z.number())
    .returns(z.promise(radarrMovieSchema))
    .implement(async id => {
      const response = await this.apiClient.get<
        z.infer<typeof radarrMovieSchema>
      >(`/api/v3/movie/${id}`);

      return response.data;
    });

  public getMovies = z
    .function()
    .returns(z.promise(z.array(radarrMovieSchema)))
    .implement(async () => {
      const response =
        await this.apiClient.get<Array<z.infer<typeof radarrMovieSchema>>>(
          '/api/v3/movie',
        );

      return response.data;
    });

  public getTags = z
    .function()
    .returns(z.promise(z.array(radarrTagSchema)))
    .implement(async () => {
      const response =
        await this.apiClient.get<Array<z.infer<typeof radarrTagSchema>>>(
          '/api/v3/tag',
        );

      return response.data;
    });

  public postTag = z
    .function()
    .args(
      z.object({
        label: z.string(),
      }),
    )
    .returns(z.promise(radarrTagSchema))
    .implement(async data => {
      const response = await this.apiClient.post<
        z.infer<typeof radarrTagSchema>
      >('/api/v3/tag', data);

      return response.data;
    });

  public putImportList = z
    .function()
    .args(z.number(), radarrImportListSchema)
    .returns(z.promise(radarrImportListSchema))
    .implement(async (id, data) => {
      const response = await this.apiClient.put<
        z.infer<typeof radarrImportListSchema>
      >(`/api/v3/importlist/${id}`, data);

      return response.data;
    });
}
