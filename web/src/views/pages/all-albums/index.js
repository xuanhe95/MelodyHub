import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Card, CardActionArea, CardMedia, Typography, CardContent } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import config from '../../../config.json';

const AllAlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);

  const fetchAlbums = useCallback(async () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };

      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/pages`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();
      setAlbums(data.slice(0, 36));
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
    <MainCard>
      <CardContent>
        <div>
          <Grid container spacing={2} sx={{ maxWidth: 2100, marginRight: 'auto', width: '100%' }}>
            {albums.map((album) => (
              <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={String(album.album_id)}>
                <Card>
                  <CardActionArea onClick={() => handleAlbumClick(album)}>
                    <CardMedia component="img" height="atuo" image={album.cover} alt={album.name} />
                    <Typography variant="h6" component="div" style={{ padding: '8px' }}>
                      {album.name}
                    </Typography>
                  </CardActionArea>
                  {selectedAlbum && selectedAlbum.id === album.id && (
                    <div>
                      <Typography variant="h5">Tracks:</Typography>
                      {tracks.length > 0 ? (
                        <ul>
                          {tracks
                            .filter((track) => track !== undefined)
                            .map((track) => (
                              <li key={track.id}>{track.title}</li>
                            ))}
                        </ul>
                      ) : (
                        <p>No tracks available</p>
                      )}
                    </div>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
        </div>
      </CardContent>
    </MainCard>
  );
};
export default AllAlbumsPage;
