import { fetchMdblistList } from '.';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { z } from 'zod';
import { providerSchema } from '../utils/config';

const mockList: z.infer<typeof providerSchema.mdblist> = {
  options: { listUrl: 'https://mdblist.com/lists/someuser/somelist' },
  expiryDays: 30,
  expiryNoticeDays: 5,
  provider: 'mdblist',
};

describe('fetchMdblistList', () => {
  it('fetches and parses mdblist data correctly', async () => {
    server.use(
      http.get('https://mdblist.com/*/json', () => {
        return HttpResponse.json([
          { imdb_id: 'tt1234567' },
          { imdb_id: 'tt2345678' },
        ]);
      }),
    );

    const result = await fetchMdblistList(mockList);

    expect(result).toEqual([{ imdbId: 'tt1234567' }, { imdbId: 'tt2345678' }]);
  });

  it('throws an error for invalid data', async () => {
    server.use(
      http.get('https://mdblist.com/*/json', () => {
        return HttpResponse.json([{ invalid_key: 'invalid_value' }]);
      }),
    );

    await expect(fetchMdblistList(mockList)).rejects.toThrow();
  });

  it('handles empty response correctly', async () => {
    server.use(
      http.get('https://mdblist.com/*/json', () => {
        return HttpResponse.json([]);
      }),
    );

    const result = await fetchMdblistList(mockList);
    expect(result).toEqual([]);
  });

  it('handles network errors', async () => {
    server.use(
      http.get('https://mdblist.com/*/json', () => {
        return HttpResponse.error();
      }),
    );

    await expect(fetchMdblistList(mockList)).rejects.toThrow();
  });
});
