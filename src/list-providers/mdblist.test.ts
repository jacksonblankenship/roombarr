import { mdblist, MovieDto } from '.';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { z } from 'zod';
import { providerSchemas } from '../lib/config';
import { generateShortHash } from '../lib/utils';

jest.mock('../lib/utils', () => ({
  generateShortHash: jest.fn().mockReturnValue('abc123'),
}));

describe('mdblist provider', () => {
  const mockList: z.infer<typeof providerSchemas.mdblist> = {
    options: { listUrl: 'https://mdblist.com/lists/someuser/somelist' },
    expiryDays: 30,
    expiryNoticeDays: 5,
    listProvider: 'mdblist',
  };

  beforeEach(() => {
    server.resetHandlers();
  });

  describe('fetchListMovies', () => {
    it('fetches and parses mdblist data correctly', async () => {
      server.use(
        http.get('*/json', () => {
          return HttpResponse.json([
            { imdb_id: 'tt1234567' },
            { imdb_id: 'tt2345678' },
          ]);
        }),
      );

      const result = await mdblist.fetchListMovies(mockList);

      expect(result).toEqual([
        { imdbId: 'tt1234567' },
        { imdbId: 'tt2345678' },
      ] satisfies MovieDto[]);
    });

    it('throws an error for invalid data', async () => {
      server.use(
        http.get('*/json', () => {
          return HttpResponse.json([{ invalid_key: 'invalid_value' }]);
        }),
      );

      await expect(mdblist.fetchListMovies(mockList)).rejects.toThrow();
    });

    it('handles empty response correctly', async () => {
      server.use(
        http.get('*/json', () => {
          return HttpResponse.json([]);
        }),
      );

      const result = await mdblist.fetchListMovies(mockList);
      expect(result).toEqual([]);
    });

    it('handles network errors', async () => {
      server.use(
        http.get('*/json', () => {
          return HttpResponse.error();
        }),
      );

      await expect(mdblist.fetchListMovies(mockList)).rejects.toThrow();
    });
  });

  describe('computeListKey', () => {
    it('computes the correct list key', () => {
      const tag = mdblist.computeListKey(mockList);
      expect(tag).toBe('mdblist:abc123');
      expect(generateShortHash).toHaveBeenCalledWith(mockList.options.listUrl);
    });
  });

  it('has the correct list provider', () => {
    expect(mdblist.listProvider).toBe('mdblist');
  });
});
