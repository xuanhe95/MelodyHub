import React, { useState, useEffect } from 'react';
import { Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import config from '../../../config.json';
// import { Container } from '@mui/material';

// material-ui
import { Typography, CardContent } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { Divider, Box } from '@mui/material';

const HomePage = () => {
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);

  const defaultImageUrl = 'https://img.freepik.com/premium-photo/cut-cat-wear-hodie_248267-607.jpg'

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // randomly fetch 10 since we don't have user associated data yet.
        const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/random/10`);
        const data = await response.json();

        // Initialize albums with placeholder images
        const initialPopular = data.slice(0, 5).map(album => ({ ...album, imageUrl: 'https://breckenridge.skyrun.com/components/com_jomholiday/assets/images/04-spinner.gif' }));
        const initialFavorite = data.slice(5, 10).map(album => ({ ...album, imageUrl: 'https://breckenridge.skyrun.com/components/com_jomholiday/assets/images/04-spinner.gif' }));

        setPopularAlbums(initialPopular);
        setFavoriteAlbums(initialFavorite);

        // Asynchronously update with actual images
        updateAlbumImages(data.slice(0, 5), setPopularAlbums);
        updateAlbumImages(data.slice(5, 10), setFavoriteAlbums);

      } catch (error) {
        console.error('Failed to fetch albums:', error);
      }
    };

    fetchAlbums();
  }, []); // The empty array ensures this effect runs only once after the component mounts.


  const updateAlbumImages = async (albums, setAlbumState) => {
    const promises = albums.map(async (album) => {
      try {
        const imgResponse = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/details/${album.album_id}/image`);
        const imgData = await imgResponse.json();
        return { ...album, imageUrl: imgData.imageUrl || defaultImageUrl };
      } catch (error) {
        console.error('Failed to fetch image for album:', album.id, error);
        return { ...album, imageUrl: defaultImageUrl }; // Use default image on error
      }
    });

    const albumsDataWithImages = await Promise.all(promises);
    setAlbumState(albumsDataWithImages);
  };


  const handleAlbumClick = () => {
    // TODO: this should direct you to the album page.
  };

  return (
    // <Container >
    <MainCard title="" sx={{ maxWidth: 2100, marginRight: 'auto', width: '100%' }}>
      <CardContent>
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Popular
        </Typography>
        <Box height={20} />
        <Grid container spacing={3}>
          {popularAlbums.map((album) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="auto" image={album.imageUrl} />
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
            <Grid item xs={6} sm={4} md={3} lg={2} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="auto" image={album.imageUrl} />
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
    // </Container>
  );
};

export default HomePage;
