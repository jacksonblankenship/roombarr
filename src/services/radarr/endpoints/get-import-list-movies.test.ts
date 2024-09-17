import { server } from '../../../../mocks/server';
import { http, HttpResponse } from 'msw';
import { getImportListMovies } from './get-import-list-movies';
import { RadarrMovie } from '../schema';

describe('getImportListMovies', () => {
  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.get('*/api/v3/importlist/movie', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json([]);
      }),
    );

    await getImportListMovies();

    expect(requestUrl).toContain('/api/v3/importlist/movie');
  });

  it('returns an array of import list movies on success', async () => {
    const testResponse: RadarrMovie[] = [
      {
        id: 123,
        title: 'Test Movie',
        year: 2024,
        added: new Date(),
        images: [],
        imdbId: 'tt123',
        overview: 'Test overview',
        tags: [],
      },
    ];

    server.use(
      http.get('*/api/v3/importlist/movie', () => {
        return HttpResponse.json(testResponse);
      }),
    );

    await expect(getImportListMovies()).resolves.toEqual(testResponse);
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/importlist/movie', () => {
        return HttpResponse.error();
      }),
    );

    await expect(getImportListMovies()).rejects.toThrow();
  });
});
