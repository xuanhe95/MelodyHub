// material-ui
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Slider,
  CardContent,
  Card,
  CardMedia,
  Box,
  CircularProgress
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { Divider } from '@mui/material';
import React, { useState, useEffect } from 'react';
// material-ui
import { useLocation } from 'react-router-dom';
// import SearchBar from './SearchBar';
import { Search } from '@mui/icons-material';

import config from '../../../config.json';

const SearchPage = () => {
  const location = useLocation();
  const { searchQuery } = location.state || {};
  const [lastId, setLastId] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [limit] = useState(12);

  const defaultImageUrl = 'https://files.readme.io/f2e91bb-portalDocs-sonosApp-defaultArtAlone.png';
  const loadingImageUrl =
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExczU2djFpdWNyZ3RheWVjankzdHc0M3RlMDYwNTc2MGRhanNpbXgzOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JFTg9PBtHZz9hHRkBN/giphy.gif';

  const [searchParams, setSearchParams] = useState({
    title: searchQuery?.title || '',
    artist: '',
    album: searchQuery?.album || '',
    tempo_low: 0,
    tempo_high: 250,
    danceability_low: 0,
    danceability_high: 1,
    energy_low: 0,
    energy_high: 1,
    duration_low: 0,
    duration_high: 1
  });

  const options = {
    title: [],
    album: []
  };

  const handleChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSliderChange = (type, newValue) => {
    setSearchParams((prev) => ({ ...prev, [type]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the title or album fields have at least 6 characters
    if (searchParams.title.length + searchParams.album.length < 7) {
      alert('Please enter at least 7 characters in the title or album fields to search.'); // Alert user or handle validation message
      return; // Stop the function if the condition is not met
    }

    setLastId(null);
    setTracks([]);
    console.log('searchParams:', searchParams);
    fetchTracks();
  };

  const handleLoadMore = async () => {
    if (lastId) {
      setIsLoading(true);
      await fetchTracks(); // 仅当 lastId 存在时调用，用于分页
      setIsLoading(false);
    }
  };

  const updateAlbumImages = async (inputAlbums, setAlbumState, maxRetries = 5, retryDelay = 200) => {
    setAlbumState(inputAlbums.map((album) => ({ ...album, imageUrl: loadingImageUrl })));

    inputAlbums.forEach(async (album, index) => {
      let retries = 0;
      const loadAlbumImage = async () => {
        try {
          console.log('Fetching image for album:', album.id);

          if (
            inputAlbums[index] &&
            inputAlbums[index].imageUrl &&
            inputAlbums[index].imageUrl !== loadingImageUrl &&
            inputAlbums[index].imageUrl !== defaultImageUrl
          ) {
            console.log('Skipping album:', album.id, 'as it already has an image');
            return;
          }

          const imgResponse = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/details/${album.id}/image`);
          if (!imgResponse.ok) throw new Error(`Failed to fetch image for album: ${album.id}`);
          const imgData = await imgResponse.json();
          if (!imgData.imageUrl && retries < maxRetries) {
            retries++;
            console.log(`Retrying to fetch image for album: ${album.id}, attempt ${retries}`);

            if (retries > 4) {
              setTimeout(loadAlbumImage, retryDelay);
            } else if (retries > 2) {
              setTimeout(loadAlbumImage, retryDelay / 2);
            } else {
              setTimeout(loadAlbumImage, retryDelay / 4);
            }
            return;
          }

          setAlbumState((prevAlbums) =>
            prevAlbums.map((item) => (item.id === album.id ? { ...item, imageUrl: imgData.imageUrl || defaultImageUrl } : item))
          );
          console.log('set album image' + imgData.imageUrl || defaultImageUrl);
        } catch (error) {
          console.error('Failed to fetch image for album:', album.id, error);
          if (retries < maxRetries) {
            retries++;
            console.log(`Retrying to fetch image for album: ${album.id}, attempt ${retries}`);

            setTimeout(loadAlbumImage, retryDelay);
          } else {
            setAlbumState((prevAlbums) => prevAlbums.map((item) => (item.id === album.id ? { ...item, imageUrl: defaultImageUrl } : item)));
          }
        }
      };

      loadAlbumImage();
    });
  };

  const fetchTracks = async () => {
    const api_address = `http://${config.server_host}:${config.server_port}/api/tracks/search`;
    // setIsLoading(true); // 开始加载数据时设置为 true
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value != null) params.append(key, value);
    });

    if (lastId) {
      params.append('last_id', String(lastId));
    }

    const urlWithParams = `${api_address}?${params.toString()}`;
    console.log('url', urlWithParams);

    try {
      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('track data:', data);
      setTracks(data.tracks);

      const tracksWithCorrectId = data.tracks.map((track) => ({ ...track, id: track.album_id }));
      updateAlbumImages(tracksWithCorrectId, setTracks);

      if (data.tracks.length > 0) {
        setLastId(data.tracks[data.tracks.length - 1].id);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      // setIsLoading(false); // 数据加载完成后设置为 false
    }
  };

  useEffect(() => {
    if (lastId === null && searchParams.title.length + searchParams.album.length >= 7) {
      setIsLoading(true);
      fetchTracks();
      setIsLoading(false);
    }
  }, [lastId, limit]);

  return (
    <MainCard>
      <CardContent>
        <Paper style={{ padding: '20px', margin: '20px' }}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Box display="flex" justifyContent="center" width="100%" gap={2}>
                  <Button type="submit" variant="contained" color="primary" style={{ width: '120px', borderRadius: '15px' }}>
                    <Search /> Search
                  </Button>
                  {Object.entries(options).map(([key, values]) => (
                    <Grid item xs={12} sm={6} key={key} style={{ width: '30%' }}>
                      <TextField
                        fullWidth
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={searchParams[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        onKeyDown={handleKeyDown}
                      >
                        {values.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  ))}
                </Box>
                {['duration', 'danceability', 'energy'].map((param) => (
                  <Grid item xs={12} sm={6} md={3} key={param}>
                    <Box display="flex" justifyContent="center" width="100%">
                      <Typography gutterBottom>{param.charAt(0).toUpperCase() + param.slice(1)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" width="100%">
                      <Slider
                        style={{ width: '95%' }}
                        value={[searchParams[`${param}_low`], searchParams[`${param}_high`]]}
                        onChange={(e, newValue) => {
                          handleSliderChange(`${param}_low`, newValue[0]);
                          handleSliderChange(`${param}_high`, newValue[1]);
                        }}
                        valueLabelDisplay="auto"
                        step={0.01}
                        marks
                        min={0}
                        max={1}
                      />
                    </Box>
                  </Grid>
                ))}
                <Grid item xs={12} sm={6} md={3} key="tempo">
                  <Box display="flex" justifyContent="center" width="100%">
                    <Typography gutterBottom>Tempo</Typography>
                  </Box>
                  <Box display="flex" justifyContent="center" width="100%">
                    <Slider
                      style={{ width: '95%' }}
                      value={[searchParams.tempo_low, searchParams.tempo_high]}
                      onChange={(e, newValue) => {
                        handleSliderChange('tempo_low', newValue[0]);
                        handleSliderChange('tempo_high', newValue[1]);
                      }}
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={0}
                      max={250}
                    />
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
        <Box height={20} />
        <Divider variant="middle" />
        <Box height={20} />
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 700 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" sx={{ height: 700 }}>
            <Grid container spacing={2}>
              {tracks.map((track) => (
                <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={track.id}>
                  <Card>
                    <CardMedia component="img" height="auto" image={track.imageUrl || defaultImageUrl} alt={track.name} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {track.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {track.album}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
          <Button variant="contained" color="primary" onClick={handleLoadMore} disabled={tracks.length === 0}>
            Load more
          </Button>
        </Box>
      </CardContent>
    </MainCard>
  );
};

export default SearchPage;
