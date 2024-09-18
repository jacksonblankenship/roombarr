ExpiryManager:

1. Fetch all movies from the pending deletion list (via PersistenceService).

2. For each movie in the pending deletion list:
   - If the movie is nearing its deletion date (within expiryNoticeDays):
     - Send a Discord warning (via DiscordNotificationService) alerting the user that the movie will be deleted soon.
   - If the movie’s expiry date has passed:
     - Call RadarrService to delete the movie from Radarr.
     - Remove the movie from the pending deletion list (via PersistenceService).

ExpiryManager:

1. Fetch all movies from the pending deletion list.
2. Check if the deletion date has passed for each movie.
3. If the deletion date has passed, delete the movie from Radarr.
4. If nearing expiry, send a Discord warning.
5. Remove the movie from the pending deletion list once deleted.

ExpiryManager:

1. checkForExpiringMovies(pendingDeletions)
   - For each movie in the pending deletion list, check if its deletion date is approaching or has passed.
   - If nearing expiry, call DiscordNotificationService to send a warning.
   - If passed expiry, delete the movie from Radarr (via RadarrService) and remove it from the pending deletion list.
