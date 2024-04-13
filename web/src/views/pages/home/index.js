import React, { useState, useEffect } from 'react';
import { Grid, Card, CardActionArea, CardMedia} from '@mui/material';
import config from '../../../config.json';

// material-ui
import { Typography, CardContent } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { Divider, Box } from '@mui/material';

const HomePage = () => {
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [favoriteAlbums, setfavoriteAlbums] = useState([]);


  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // randomly fetch 10 since we don't have user associated data yet.
        const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/random/10`);
        const data = await response.json();

        setPopularAlbums(data.slice(0,5));
        setfavoriteAlbums(data.slice(5,10));
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      }
    };
  
    fetchAlbums();
  }, []); // The empty array ensures this effect runs only once after the component mounts.

  const handleAlbumClick = () => {
    // TODO: this should direct you to the album page.
  };

  return (
    <MainCard title="">
      <CardContent>
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Popular
        </Typography>
        <Box height={20} />
        <Grid container spacing={3}>
          {popularAlbums.map((album) => (
            <Grid item xs={6} sm={4} md={2} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="180" image={album.cover} alt={album.cover} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {album.album}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box height={20} />
        <Divider variant="middle" />
        <Box height={50} />
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Favorite
        </Typography>
        <Box height={20} />
        <Grid container spacing={3}>
          {favoriteAlbums.map((album) => (
            <Grid item xs={6} sm={4} md={2} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="180" image={album.cover} alt={album.title} />
                </CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {album.album}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default HomePage;
