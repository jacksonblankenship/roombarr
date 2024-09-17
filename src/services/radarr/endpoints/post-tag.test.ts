import { http, HttpResponse } from 'msw';
import { server } from '../../../../mocks/server';
import { postTag } from './post-tag';
import { RadarrTag } from '../schema';

describe('postTag', () => {
  const testRequest = {
    label: 'Test Tag',
  };

  const testResponse: RadarrTag = {
    id: 123,
    label: testRequest.label,
  };

  it('calls the correct API endpoint', async () => {
    let requestUrl = '';
    server.use(
      http.post('*/api/v3/tag', ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json(testResponse);
      }),
    );

    await postTag(testRequest);

    expect(requestUrl).toContain('/api/v3/tag');
  });

  it('returns a tag on success', async () => {
    server.use(
      http.post('*/api/v3/tag', () => {
        return HttpResponse.json(testResponse);
      }),
    );

    await expect(postTag(testRequest)).resolves.toEqual(testResponse);
  });

  it('handles network errors', async () => {
    server.use(
      http.post('*/api/v3/tag', () => {
        return HttpResponse.error();
      }),
    );

    await expect(postTag(testRequest)).rejects.toThrow();
  });
});
