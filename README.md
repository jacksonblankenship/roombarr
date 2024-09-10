# Roombarr 🧹🍿

> **⚠️ Disclaimer: Roombarr is in its early stages and primarily built for personal use. Expect frequent breaking changes. This open-source software is provided "as-is," and users must review the code and assess the risks before using it in their own environments. We assume no responsibility for data loss, legal issues, or other unintended consequences. Always back up your media library before using Roombarr.**

Roombarr is a tool for automating the cleanup of your Radarr-managed media library. It detects orphaned movies (those in Radarr but not in MDBList) and manages notifications and deletions to keep your library organized.

Roombarr allows you to use MDBList's dynamic lists (e.g., IMDb Top 250, Most Watched This Year) while protecting manually added movies from deletion. Unlike Radarr's built-in deletion, which affects all non-listed movies, Roombarr intelligently distinguishes between list-imported and manually added content.

## Features

- Detect orphaned movies from MDBList.
- Automatically delete expired movies.
- Notify via Discord before deletion.
- Preserve manually added movies while managing list-imported ones.

## Installation

### Step 1: Radarr Setup

1. Go to **Settings > Import Lists** in Radarr.
2. Edit your MDBList and set a **Radarr Tag** to apply to all movies imported by the list.
3. Note the **Tag ID**—you'll need this for the `RADARR_MDBLIST_TAG_ID` environment variable.

### Step 2: Docker Compose

```yml
services:
  roombarr:
    image: ghcr.io/jacksonblankenship/roombarr:latest
    restart: unless-stopped
    environment:
      - TZ=${TZ}
      - RADARR_URL=${RADARR_URL}
      - RADARR_API_KEY=${RADARR_API_KEY}
      - RADARR_MDBLIST_TAG_ID=${RADARR_MDBLIST_TAG_ID}
      - MDBLIST_USERNAME=${MDBLIST_USERNAME}
      - MDBLIST_LIST_NAME=${MDBLIST_LIST_NAME}
      - DISCORD_WEBHOOK_URL=${DISCORD_WEBHOOK_URL}
      - MOVIE_EXPIRY_DAYS=${MOVIE_EXPIRY_DAYS}
      - DAYS_BEFORE_EXPIRY_NOTICE=${DAYS_BEFORE_EXPIRY_NOTICE}
      - LOG_LEVEL=${LOG_LEVEL}
      - CRON_SCHEDULE=${CRON_SCHEDULE}
```

### Step 3: Environment Variables

Configure these in your `.env` file:

- `TZ`: Time zone for cron jobs (e.g., `America/New_York`).
- `RADARR_URL`: Radarr server URL (required).
- `RADARR_API_KEY`: Radarr API key (required).
- `RADARR_MDBLIST_TAG_ID`: Tag ID assigned to MDBList-imported movies (required).
- `MDBLIST_USERNAME`: MDBList account username (required).
- `MDBLIST_LIST_NAME`: MDBList list name to monitor (required).
- `DISCORD_WEBHOOK_URL`: Webhook for notifications (required).
- `MOVIE_EXPIRY_DAYS`: Number of days after which movies are considered expired (default: 30).
- `DAYS_BEFORE_EXPIRY_NOTICE`: Days before deletion to notify (default: 5).
- `CRON_SCHEDULE`: Schedule for running Roombarr (default: daily at midnight).
- `LOG_LEVEL`: Logging level (`info` or `debug`, default: `info`).

### Step 4: Running Roombarr

Start Roombarr using Docker Compose:

```bash
docker-compose up -d
```

## License

MIT
