/* 
Top songs and artists in each country:
SELECT ts.country, t.name, COUNT(*) as popularity
FROM top_songs_by_country ts
JOIN tracks t ON ts.spotify_id = t.id
GROUP BY ts.country, t.name
ORDER BY popularity DESC
LIMIT 3;


*/