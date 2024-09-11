import axios from 'axios';
import { env } from '../lib/env';

export const radarr = axios.create({
  baseURL: `${env.RADARR_BASE_URL}:${env.RADARR_PORT}`,
  headers: {
    'X-Api-Key': env.RADARR_API_KEY,
  },
});
