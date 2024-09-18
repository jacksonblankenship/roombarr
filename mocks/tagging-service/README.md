TaggingService:

1. For each list in `config.yml`, generate a unique tag name.
2. Check if the tag already exists in Radarr.
3. If the tag doesn’t exist, create it in Radarr.
4. Attach the tag to the monitored import list in Radarr.

TaggingService:

1. ensureTagsForLists(config)
   - For each list in `config.yml`, generates a unique tag.
   - Calls `RadarrService` to check if the tag exists.
   - If not, creates the tag in Radarr.
   - Attaches the tag to the corresponding import list in Radarr.
