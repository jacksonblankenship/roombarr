import { http, HttpResponse } from 'msw';
import { RadarrService } from './radarr-service';
import { server } from '../../mocks/server';
import {
  RadarrImportList,
  RadarrMovie,
  RadarrTag,
} from './radarr-service.schema';

describe('RadarrService', () => {
  let radarrService: RadarrService;

  const testMovie: RadarrMovie = {
    id: 123,
    title: 'Test Movie',
    year: 2024,
    added: new Date(),
    images: [],
    imdbId: 'tt123',
    overview: 'Test overview',
    tags: [],
  };

  const testImportList: RadarrImportList = {
    id: 123,
    name: 'Test List',
    tags: [456],
  };

  const testTag: RadarrTag = {
    id: 123,
    label: 'Test Tag',
  };

  beforeEach(() => {
    radarrService = new RadarrService('http://localhost', 7878, 'apiKey');
  });

  describe('deleteMovie', () => {
    it('calls the correct API endpoint to delete a movie', async () => {
      let requestUrl = '';
      server.use(
        http.delete('*/api/v3/movie/*', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json();
        }),
      );

      await radarrService.deleteMovie(123);

      expect(requestUrl).toContain('/api/v3/movie/123');
    });

    it('successfully deletes a movie', async () => {
      server.use(
        http.delete('*/api/v3/movie/*', () => {
          return HttpResponse.json();
        }),
      );

      await expect(radarrService.deleteMovie(123)).resolves.not.toThrow();
    });

    it('handles network errors', async () => {
      server.use(
        http.delete('*/api/v3/movie/*', () => {
          return HttpResponse.error();
        }),
      );

      await expect(radarrService.deleteMovie(123)).rejects.toThrow();
    });
  });

  describe('getImportListMovies', () => {
    it('calls the correct API endpoint to fetch import list movies', async () => {
      let requestUrl = '';
      server.use(
        http.get('*/api/v3/importlist/movie', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json([]);
        }),
      );

      await radarrService.getImportListMovies();

      expect(requestUrl).toContain('/api/v3/importlist/movie');
    });

    it('returns an array of import list movies on success', async () => {
      const testResponse: RadarrMovie[] = [testMovie];

      server.use(
        http.get('*/api/v3/importlist/movie', () => {
          return HttpResponse.json(testResponse);
        }),
      );

      await expect(radarrService.getImportListMovies()).resolves.toEqual(
        testResponse,
      );
    });

    it('handles network errors', async () => {
      server.use(
        http.get('*/api/v3/importlist/movie', () => {
          return HttpResponse.error();
        }),
      );

      await expect(radarrService.getImportListMovies()).rejects.toThrow();
    });
  });

  describe('getImportList', () => {
    const testResponse: RadarrImportList = testImportList;

    it('calls the correct API endpoint to fetch an import list by ID', async () => {
      let requestUrl = '';
      server.use(
        http.get('*/api/v3/importlist/*', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(testResponse);
        }),
      );

      await radarrService.getImportList(123);

      expect(requestUrl).toContain('/api/v3/importlist/123');
    });

    it('returns an import list on success', async () => {
      server.use(
        http.get('*/api/v3/importlist/*', () => {
          return HttpResponse.json(testResponse);
        }),
      );

      await expect(radarrService.getImportList(123)).resolves.toEqual(
        testResponse,
      );
    });

    it('handles network errors', async () => {
      server.use(
        http.get('*/api/v3/importlist/*', () => {
          return HttpResponse.error();
        }),
      );

      await expect(radarrService.getImportList(123)).rejects.toThrow();
    });
  });

  describe('getImportLists', () => {
    const testResponse: RadarrImportList[] = [testImportList];

    it('calls the correct API endpoint to fetch all import lists', async () => {
      let requestUrl = '';
      server.use(
        http.get('*/api/v3/importlist', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(testResponse);
        }),
      );

      await radarrService.getImportLists();

      expect(requestUrl).toContain('/api/v3/importlist');
    });

    it('returns an array of import lists on success', async () => {
      server.use(
        http.get('*/api/v3/importlist', () => {
          return HttpResponse.json(testResponse);
        }),
      );

      await expect(radarrService.getImportLists()).resolves.toEqual(
        testResponse,
      );
    });

    it('handles network errors', async () => {
      server.use(
        http.get('*/api/v3/importlist', () => {
          return HttpResponse.error();
        }),
      );

      await expect(radarrService.getImportLists()).rejects.toThrow();
    });
  });

  describe('getMovie', () => {
    const testResponse: RadarrMovie = testMovie;

    it('calls the correct API endpoint to fetch a movie by ID', async () => {
      let requestUrl = '';
      server.use(
        http.get('*/api/v3/movie/*', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(testResponse);
        }),
      );

      await radarrService.getMovie(123);

      expect(requestUrl).toContain('/api/v3/movie/123');
    });

    it('returns a movie on success', async () => {
      server.use(
        http.get('*/api/v3/movie/*', () => {
          return HttpResponse.json(testResponse);
        }),
      );

      await expect(radarrService.getMovie(123)).resolves.toEqual(testResponse);
    });

    it('handles network errors', async () => {
      server.use(
        http.get('*/api/v3/movie/*', () => {
          return HttpResponse.error();
        }),
      );

      await expect(radarrService.getMovie(123)).rejects.toThrow();
    });
  });

  describe('getMovies', () => {
    const testResponse: RadarrMovie[] = [testMovie];

    it('calls the correct API endpoint to fetch all movies', async () => {
      let requestUrl = '';
      server.use(
        http.get('*/api/v3/movie', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(testResponse);
        }),
      );

      await radarrService.getMovies();

      expect(requestUrl).toContain('/api/v3/movie');
    });

    it('returns an array of movies on success', async () => {
      server.use(
        http.get('*/api/v3/movie', () => {
          return HttpResponse.json(testResponse);
        }),
      );

      await expect(radarrService.getMovies()).resolves.toEqual(testResponse);
    });

    it('handles network errors', async () => {
      server.use(
        http.get('*/api/v3/movie', () => {
          return HttpResponse.error();
        }),
      );

      await expect(radarrService.getMovies()).rejects.toThrow();
    });
  });

  describe('getTags', () => {
    const testResponse: RadarrTag[] = [testTag];

    it('calls the correct API endpoint to fetch all tags', async () => {
      let requestUrl = '';
      server.use(
        http.get('*/api/v3/tag', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(testResponse);
        }),
      );

      await radarrService.getTags();

      expect(requestUrl).toContain('/api/v3/tag');
    });

    it('returns an array of tags on success', async () => {
      server.use(
        http.get('*/api/v3/tag', () => {
          return HttpResponse.json(testResponse);
        }),
      );

      await expect(radarrService.getTags()).resolves.toEqual(testResponse);
    });

    it('handles network errors', async () => {
      server.use(
        http.get('*/api/v3/tag', () => {
          return HttpResponse.error();
        }),
      );

      await expect(radarrService.getTags()).rejects.toThrow();
    });
  });

  describe('postTag', () => {
    const testRequest = testTag;

    const testResponse: RadarrTag = testTag;

    it('calls the correct API endpoint to post a tag', async () => {
      let requestUrl = '';
      server.use(
        http.post('*/api/v3/tag', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(testResponse);
        }),
      );

      await radarrService.postTag(testRequest);

      expect(requestUrl).toContain('/api/v3/tag');
    });

    it('returns the created tag on success', async () => {
      server.use(
        http.post('*/api/v3/tag', () => {
          return HttpResponse.json(testResponse);
        }),
      );

      await expect(radarrService.postTag(testRequest)).resolves.toEqual(
        testResponse,
      );
    });

    it('handles network errors', async () => {
      server.use(
        http.post('*/api/v3/tag', () => {
          return HttpResponse.error();
        }),
      );

      await expect(radarrService.postTag(testRequest)).rejects.toThrow();
    });
  });

  describe('putImportList', () => {
    const testRequest: RadarrImportList = testImportList;

    const testResponse: RadarrImportList = testImportList;

    it('calls the correct API endpoint to update an import list', async () => {
      let requestUrl = '';
      server.use(
        http.put('*/api/v3/importlist/*', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(testResponse);
        }),
      );

      await radarrService.putImportList(123, testRequest);

      expect(requestUrl).toContain('/api/v3/importlist/123');
    });

    it('returns the updated import list on success', async () => {
      server.use(
        http.put('*/api/v3/importlist/*', () => {
          return HttpResponse.json(testResponse);
        }),
      );

      await expect(
        radarrService.putImportList(123, testRequest),
      ).resolves.toEqual(testResponse);
    });

    it('handles network errors', async () => {
      server.use(
        http.put('*/api/v3/importlist/*', () => {
          return HttpResponse.error();
        }),
      );

      await expect(
        radarrService.putImportList(123, testRequest),
      ).rejects.toThrow();
    });
  });
});
