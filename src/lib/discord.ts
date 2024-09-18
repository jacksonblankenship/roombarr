import { env } from '../../lib/env';
import { WebhookClient } from 'discord.js';

export const discord = env.DISCORD_WEBHOOK_URL
  ? new WebhookClient({ url: env.DISCORD_WEBHOOK_URL })
  : undefined;
