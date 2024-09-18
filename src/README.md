START Roombarr

1. Load Configurations:

   - Call ConfigService to load and validate `config.yml`.
   - If invalid, exit the application and log the error.

2. Validate Import Lists:

   - Fetch all import lists from Radarr (via RadarrService).
   - For each list in `config.yml`, check if it exists in Radarr:
     - If a list does not exist, log the error and exit the application.
     - If all lists exist, continue.

3. Initialize Tags for Import Lists:

   - For each list in `config.yml`, generate a unique tag (e.g., "roombarr-top-rated-movies").
   - Check if the tag exists in Radarr (via RadarrService):
     - If it does not exist, create it.
   - Ensure each monitored import list has its corresponding unique tag.

4. Fetch Current Data from Radarr:

   - Call RadarrService to fetch all monitored import lists from Radarr.
   - Call RadarrService to fetch all movies currently tagged with any "roombarr-{list-name}" tag.

5. Compare Current Import Lists and Tagged Movies:

   - For each movie with a "roombarr-{list-name}" tag:
     - Check if the movie is still on the corresponding import list.

6. Handle Movies That Have Fallen Off Lists:

   - If a movie is no longer on any import list:
     - Add the movie to the **pending deletion list** via PersistenceService.
     - Store the movie’s removal date and calculate the deletion date (removal date + expiryDays from config.yml).

7. Fetch Movies Pending Deletion:

   - Call PersistenceService to load the list of movies currently pending deletion.

8. Verify Pending Deletion Movies:

   - For each movie in the pending deletion list:
     - Check if the movie has reappeared on any import list in Radarr (via RadarrService).
     - If the movie has reappeared, remove it from the pending deletion list (via PersistenceService).
     - If the movie is still missing and nearing its deletion date (within expiryNoticeDays), send a warning.

9. Log Actions:

   - Log any movies added to the pending deletion list.
   - Log any warnings sent to Discord for movies nearing deletion.
   - Log any movies deleted from Radarr.

END Roombarr
