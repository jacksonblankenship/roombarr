ListMonitoringService:

1. Fetch all movies on monitored import lists and those tagged with "roombarr-{list-name}".
2. Identify movies that have fallen off their respective import lists.
3. Add those movies to the pending deletion list (via PersistenceService).

ListMonitoringService:

1. checkForMoviesOffLists(currentMovies, taggedMovies)
   - Compare the movies on the current lists with movies tagged with "roombarr-{list-name}".
   - If a movie has fallen off the list, add it to the pending deletion list (via PersistenceService).
   - Returns an updated pending deletion list.
