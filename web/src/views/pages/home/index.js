import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardMedia} from '@mui/material';
import config from '../../../config.json';

// material-ui
import { Typography, CardContent } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { Divider, Box } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate(); 
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);

  const defaultImageUrl = 'https://img.freepik.com/premium-photo/cut-cat-wear-hodie_248267-607.jpg'

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // randomly fetch 10 since we don't have user associated data yet.
        const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/random/8`);
        const data = await response.json();

        // Initialize albums with placeholder images
        const initialPopular = data.slice(0, 4).map(album => ({ ...album, imageUrl: 'https://breckenridge.skyrun.com/components/com_jomholiday/assets/images/04-spinner.gif' }));
        const initialFavorite = data.slice(4, 8).map(album => ({ ...album, imageUrl: 'https://breckenridge.skyrun.com/components/com_jomholiday/assets/images/04-spinner.gif' }));

        setPopularAlbums(initialPopular);
        setFavoriteAlbums(initialFavorite);

        // Asynchronously update with actual images
        updateAlbumImages(data.slice(0, 4), setPopularAlbums);
        updateAlbumImages(data.slice(4, 8), setFavoriteAlbums);

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


  const handleAlbumClick = (album) => {
    navigate(`/album/details/${album.album_id}`);
  };

  return (
    <MainCard title="">
      <CardContent>
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Made for You
        </Typography>
        <Box height={20} />
        <Grid container spacing={3}>
          {popularAlbums.map((album) => (
            <Grid item xs={7} sm={5} md={3} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="300" image={album.imageUrl} />
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
        <Box height={20} />
        <Grid container spacing={3}>
          {favoriteAlbums.map((album) => (
            <Grid item xs={7} sm={5} md={3} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="300" image={album.imageUrl} />
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
