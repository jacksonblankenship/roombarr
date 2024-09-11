import axios from 'axios';
import { ListProvider } from '.';
import { z } from 'zod';
import { map } from 'remeda';

const mdblistMovieSchema = z.object({
  imdb_id: z.string().startsWith('tt').length(9),
});

const mdblistResponseSchema = z.array(mdblistMovieSchema);

export const fetchMdblistList: ListProvider<'mdblist'> = async list => {
  const response = await axios.get(`${list.options.listUrl}/json`);

  const data = mdblistResponseSchema.parse(response.data);

  return map(data, movie => ({
    imdbId: movie.imdb_id,
  }));
};
