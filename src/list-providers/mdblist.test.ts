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

  describe('fetchList', () => {
    it('fetches and parses mdblist data correctly', async () => {
      server.use(
        http.get('*/json', () => {
          return HttpResponse.json([
            { imdb_id: 'tt1234567' },
            { imdb_id: 'tt2345678' },
          ]);
        }),
      );

      const result = await mdblist.fetchList(mockList);

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

      await expect(mdblist.fetchList(mockList)).rejects.toThrow();
    });

    it('handles empty response correctly', async () => {
      server.use(
        http.get('*/json', () => {
          return HttpResponse.json([]);
        }),
      );

      const result = await mdblist.fetchList(mockList);
      expect(result).toEqual([]);
    });

    it('handles network errors', async () => {
      server.use(
        http.get('*/json', () => {
          return HttpResponse.error();
        }),
      );

      await expect(mdblist.fetchList(mockList)).rejects.toThrow();
    });
  });

  describe('generateTag', () => {
    it('generates the correct tag', () => {
      const tag = mdblist.generateTag(mockList);
      expect(tag).toBe('mdblist:abc123');
      expect(generateShortHash).toHaveBeenCalledWith(mockList.options.listUrl);
    });
  });

  it('has the correct id', () => {
    expect(mdblist.id).toBe('mdblist');
  });
});
