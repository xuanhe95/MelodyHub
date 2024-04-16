// material-ui
import { TextField, Button, Typography, Paper, Grid, MenuItem, Slider, CardContent, Pagination, Card, CardMedia, Box } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { Divider } from '@mui/material';
import React, { useState, useEffect } from 'react';
// material-ui
import { useLocation } from 'react-router-dom';
// import SearchBar from './SearchBar';
import { Search } from '@mui/icons-material';

import config from '../../../config.json';

// ==============================|| SAMPLE PAGE ||============================== //
const SearchPage = () => {
  const location = useLocation();
  const { searchQuery } = location.state || {};  // 使用解构来获取state，如果state不存在则默认为空对象

  const [tracks, setTracks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [totalPages, setTotalPages] = useState(0);
  const defaultImageUrl = 'https://files.readme.io/f2e91bb-portalDocs-sonosApp-defaultArtAlone.png';
  // const loadingImageUrl = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExczU2djFpdWNyZ3RheWVjankzdHc0M3RlMDYwNTc2MGRhanNpbXgzOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JFTg9PBtHZz9hHRkBN/giphy.gif';
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
    album: [],
  };

  const handleChange = (name, value) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 阻止表单默认提交事件
      handleSubmit(e); // 调用搜索函数
    }
  };

  const handleSliderChange = (type, newValue) => {
    setSearchParams(prev => ({ ...prev, [type]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage(1);
    fetchTracks();
  };

  const fetchTracks = async () => {
    const api_address = `http://${config.server_host}:${config.server_port}/api/tracks/search`;

    // 创建 URLSearchParams 对象，并添加查询参数
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value != null) params.append(key, value); // 仅添加非空参数
    });

    params.append('page', String(page));
    params.append('limit', String(limit));
    console.log('Searching with params:', params);

    // 将查询参数添加到 URL
    const urlWithParams = `${api_address}?${params.toString()}`;
    console.log('url', urlWithParams);
    console.log('Searching with params:', searchParams);



    try {
      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setTracks(data.tracks);
      setTotalPages(data.total);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  }

  useEffect(() => {
    fetchTracks();
  }, [page, limit]);


  const handlePageChange = (event, value) => {
    console.log('Page changed:', value);
    setPage(value);
  };

  return (
    <MainCard>
      <CardContent>

        <Paper style={{ padding: '20px', margin: '20px' }}>
          <Box>


            <form onSubmit={handleSubmit}>

              <Grid container spacing={2}>

                <Box display="flex" justifyContent="center" width="100%" gap={2}>
                  <Button type="submit" variant="contained" color="primary" style={{ width: '120px', borderRadius: '15px' }}>
                    <Search />  Search
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
                        {values.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  ))}

                </Box>
                {['duration', 'danceability', 'energy'].map((param) => (
                  <Grid item xs={12} sm={6} md={3} key={param}> <Box display="flex" justifyContent="center" width="100%">
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
                <Grid
                  item xs={12} sm={6} md={3} key="tempo"> <Box display="flex" justifyContent="center" width="100%">
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
        <Divider />
        {/* <SearchBar onSearch={(query) => console.log(query)} /> */}

      </CardContent>
      <CardContent>


        <Grid container spacing={2} >
          {tracks.map((track) => (
            <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={String(track.id)}>
              <Card>
                {/* <CardActionArea onClick={() => handleAlbumClick(album)}> */}
                <CardMedia component="img" height="auto" image={track.imageUrl || defaultImageUrl} alt={track.name} />
                <Typography variant="h5" component="div" style={{ padding: '8px' }}>
                  {track.name}
                </Typography>
                <Typography variant="h6" component="div" style={{ padding: '8px', fontWeight: 'lighter' }}>
                  {track.album}</Typography>
                {/* </CardActionArea> */}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 
        {tracks &&
          tracks.length > 0 ? (
          <Grid container spacing={2}>
            {tracks.map((track, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={2} style={{ padding: '20px' }}>
                  <Typography variant="h5" gutterBottom>{track.title}</Typography>
                  <Typography variant="body2">Artist: {track.artist}</Typography>
                  <Typography variant="body2">Album: {track.album}</Typography>
                  <Typography variant="body2">Duration: {track.duration}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No tracks found.</Typography>
        )} */}

        <Pagination
          count={totalPages} // 总页数
          page={page} // 当前页码
          onChange={handlePageChange} // 页码改变时的处理函数
          color="primary" // 颜色主题
          sx={{ marginTop: 2, marginBottom: 2, display: 'flex', justifyContent: 'center' }} // 样式
        />


      </CardContent>


    </MainCard >
  );
};

export default SearchPage;