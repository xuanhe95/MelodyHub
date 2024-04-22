import React, { useState } from 'react';
import { CardContent, Grid, Typography, TextField, styled, IconButton, InputAdornment } from '@mui/material';
import { ArrowCircleLeft,ArrowCircleRight , Search as SearchIcon } from '@mui/icons-material'; 
import MainCard from 'ui-component/cards/MainCard';
import config from '../../../config.json';

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.spacing(1),
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const ConcertPage = () => {
  const [concerts, setConcerts] = useState([]);
  const [artistName, setArtistName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchConcert = async (mbid, page) => {
    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/artist/${mbid}/setlists?p=${page}`);     
      const data = await response.json();

      console.log('Fetched mbid:', mbid);
      console.log('Fetched page:', page);
      console.log('Fetched concerts:', data);

      const alldata = data.concerts.map(setlistItem => ({
        date: setlistItem.date,
        name: setlistItem.name,
        venue: setlistItem.venue,
        city: setlistItem.city,
        state: setlistItem.state,
        country: setlistItem.country,
        //tour: setlistItem.tour,
        setlist_link: setlistItem.url,
      }));
      setConcerts(alldata);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch concert data:', error);
    }
  };

  const getMbid = async (page) => {
    try {
      console.log('Page', page)
      const response = await fetch(`https://musicbrainz.org/ws/2/artist?query=${artistName}&fmt=json`);
      const data = await response.json();
      const mbid = data.artists[0].id;
      fetchConcert(mbid, page);
    } catch (error) {
      console.error('Failed to fetch MBID:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getMbid(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setCurrentPage(1);
      getMbid(currentPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      console.log('currentPage', currentPage)
      setCurrentPage(currentPage + 1);
      getMbid(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      getMbid(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  return (
    <MainCard title="Concert Search">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Enter Artist Name"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} aria-label="search">
                      <SearchIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {concerts.length > 0 && (
              <>
                {concerts.map((concert, index) => (
                  <StyledCardContent key={index}>
                    <Typography variant="subtitle1">Date: {formatDate(concert?.date)}</Typography>
                    <Typography variant="subtitle1">Artist: {concert?.name}</Typography>
                    <Typography variant="subtitle1">Venue: {concert?.venue}</Typography>
                    <Typography variant="subtitle1">Location: {`${concert?.city}, ${concert?.state}, ${concert?.country}`}</Typography>
                    <Typography variant="subtitle1">Setlist: <a href={concert?.setlist_link} target="_blank" rel="noopener noreferrer">{concert?.setlist_link}</a></Typography>
                  </StyledCardContent>
                ))}
              </>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            {currentPage > 1 && (
              <IconButton onClick={handlePrevPage}>
                <ArrowCircleLeft />
              </IconButton>
            )}
          </Grid>
          <Grid item>
            {currentPage < totalPages && (
              <IconButton onClick={handleNextPage}>
                <ArrowCircleRight />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default ConcertPage;