import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Card, CardActionArea, CardMedia, Typography } from '@mui/material';
import config from '../../../config.json';

const AlbumPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);

  const fetchAlbums = useCallback(async () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();
      setAlbums(data.slice(0, 12));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const fetchTracks = useCallback(async (albumId) => {
    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/${albumId}/tracks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tracks for the album');
      }
      const data = await response.json();
      console.log('Fetched tracks:', data); // Debugging statement
      setTracks(data);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const handleAlbumClick = async (album) => {
    if (selectedAlbum && selectedAlbum.id === album.id) {
      setSelectedAlbum(null);
      setTracks([]); // Clear tracks when collapsing
    } else {
      setSelectedAlbum(album);
      await fetchTracks(album.id); // Fetch tracks when expanding
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        {albums.map((album) => (
          <Grid item xs={12} sm={6} md={3} key={String(album.album_id)}>
            <Card>
              <CardActionArea onClick={() => handleAlbumClick(album)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={album.cover}
                  alt={album.name}
                />
                <Typography variant="h6" component="div" style={{ padding: '8px' }}>
                  {album.name}
                </Typography>
              </CardActionArea>
              {selectedAlbum && selectedAlbum.id === album.id && (
                <div>
                  <Typography variant="h5">Tracks:</Typography>
                  <ul>
                    {tracks.map((track) => (
                      <li key={track.id}>{track.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default AlbumPage;
