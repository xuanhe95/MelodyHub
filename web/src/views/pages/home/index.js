import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import config from '../../../config.json';
// import { Container } from '@mui/material';

// material-ui
import { Typography, CardContent } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { Divider, Box } from '@mui/material';

const HomePage = () => {
  const navigate = useNavigate();
  const [popularAlbums, setPopularAlbums] = useState([]);

  //const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTetYniHzzXBzERIr7kiWQldnJLoaNhYbmgOk0mimmKubR8Mjb9ry-32knM5D_DdutMcE8&usqp=CAU'
  const defaultImageUrl =
    'https://yt3.googleusercontent.com/-PdzRcsbWuUsX0R5sJWknVvo3_gp3IqAwPPXvBWBeUxllHgM28XStKdFP4MNXbhLcPL4JcfutQ=s900-c-k-c0x00ffffff-no-rj';

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // randomly fetch 10 since we don't have user associated data yet.
        const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/random/8`);
        const data = await response.json();

        // Initialize albums with placeholder images
        const initialPopular = data.slice(0, 8).map((album) => ({
          ...album,
          imageUrl: 'https://breckenridge.skyrun.com/components/com_jomholiday/assets/images/04-spinner.gif'
        }));

        setPopularAlbums(initialPopular);

        // update with artist info first
        // TODO: this is a bit slow, temporarily removed unless optimized.
        //const albumsDataWithArtist = await updateAlbumArtist(initialPopular);
        //setPopularAlbums(albumsDataWithArtist)

        // then update with actual images
        updateAlbumImages(initialPopular, setPopularAlbums);
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

  /*
  const updateAlbumArtist = async (albums) => {
    const promises = albums.map(async (album) => {
      try {
        const artistsResponse = await fetch(`http://${config.server_host}:${config.server_port}/api/artists/byalbum/${album.album_id}`);
        const artists = await artistsResponse.json();
        return { ...album, artist: artists.length > 0 ? artists[0].artist : "Unknown Artist" };
      } catch (error) {
        console.error('Failed to fetch artist for album:', album.id, error);
        return { ...album, artist: "Unknown Artist" }; // Use default image on error
      }
    });

    const albumsDataWithArtist = await Promise.all(promises);
    return albumsDataWithArtist;
  };*/

  const handleAlbumClick = (album) => {
    navigate(`/album/details/${album.album_id}`);
  };

  return (
    // <Container >
    <MainCard title="" sx={{ maxWidth: 2100, marginRight: 'auto', width: '100%' }}>
      <CardContent>
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Made for You
        </Typography>
        <Box height={20} />
        <Grid container spacing={3}>
          {popularAlbums.slice(0, 4).map((album) => (
            <Grid item xs={7} sm={5} md={3} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="250" image={album.imageUrl} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {album.album}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {album.artist}
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
          {popularAlbums.slice(4, 8).map((album) => (
            <Grid item xs={7} sm={5} md={3} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="250" image={album.imageUrl} />
                </CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {album.album}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {album.artist}
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
