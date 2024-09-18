PersistenceService:

1. Load the JSON file `pending_deletions.json` into memory on startup.

   - If the file doesn’t exist, create an empty list.

2. Add a movie to the pending deletion list:

   - Add a new movie entry with movie ID, list-specific tag, removal date, and calculated expiry date.
   - Save the updated list back to the JSON file.

3. Remove a movie from the pending deletion list:

   - If a movie reappears on any monitored import list, remove it from the list.
   - Save the updated list back to the JSON file.

4. Fetch movies from the pending deletion list:
   - Return the in-memory list of movies pending deletion.

PersistenceService:

1. Load `pending_deletions.json` file into memory on startup.
2. Add a movie to the pending deletion list.
3. Remove a movie from the pending deletion list.
4. Fetch the list of movies pending deletion.
5. Save the in-memory list back to the JSON file.

PersistenceService:

1. loadPendingDeletions()

   - Loads the `pending_deletions.json` file into memory.
   - Returns an array of movies pending deletion.

2. addMovieToPending(movie)

   - Adds a new movie to the pending deletion list.
   - Saves the updated list to `pending_deletions.json`.

3. removeMovieFromPending(movieId)

   - Removes a movie from the pending deletion list.
   - Saves the updated list to `pending_deletions.json`.

4. savePendingDeletions(pendingDeletions)
   - Saves the in-memory list back to the JSON file.
