import { http, HttpResponse } from 'msw';
import { server } from '../../../../mocks/server';
import { getTags } from './get-tags';
import { RadarrTag } from '../schema';

describe('getTags', () => {
  const testResponse: RadarrTag[] = [
    {
      id: 123,
      label: 'Test Tag',
    },
  ];

  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.get('*/api/v3/tag', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(testResponse);
      }),
    );

    await getTags();

    expect(requestUrl).toContain('/api/v3/tag');
  });

  it('returns an array of tags on success', async () => {
    server.use(
      http.get('*/api/v3/tag', () => {
        return HttpResponse.json(testResponse);
      }),
    );

    await expect(getTags()).resolves.toEqual(testResponse);
  });

  it('handles network errors', async () => {
    server.use(
      http.get('*/api/v3/tag', () => {
        return HttpResponse.error();
      }),
    );

    await expect(getTags()).rejects.toThrow();
  });
});
