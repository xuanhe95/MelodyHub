/*
Searching songs by artist name:
SELECT t.* FROM tracks t
JOIN artists_tracks at ON t.id = at.track_id
JOIN artists a ON at.artist_id = a.id
WHERE a.name LIKE '%keyword%';

Recommended artists based on preferences:
SELECT a.* FROM artists a
JOIN artists_genres ag ON a.id = ag.artist_id
WHERE ag.genre IN ('genre1', 'genre2', 'genre3');


Music genres favored in different decades:
SELECT genre, COUNT(*) as popularity
FROM tracks
WHERE year BETWEEN YEAR1 AND YEAR2
GROUP BY genre
ORDER BY popularity DESC;


*/
