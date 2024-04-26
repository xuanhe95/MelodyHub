import React, { useState, useEffect } from 'react';
import { CardContent, Grid, Typography, TextField, styled, IconButton, InputAdornment, Box, Divider } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Search as SearchIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import config from '../../../config.json';

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.spacing(1),
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
  }
}));

const ConcertPage = () => {
  const [concerts, setConcerts] = useState([]);
  const [artistName, setArtistName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTriggered, setSearchTriggered] = useState(false);

  useEffect(() => {
    if (searchTriggered) {
      // Only trigger search if search is explicitly triggered
      if (artistName.trim() !== '') {
        getMbid(1);
      }
      setSearchTriggered(false);
    }
    // eslint-disable-next-line
  }, [artistName, searchTriggered]);

  const fetchConcert = async (mbid, page) => {
    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/artist/${mbid}/setlists?p=${page}`);
      const data = await response.json();

      const alldata = data.concerts.map((setlistItem) => {
        const [day, month, year] = setlistItem.date.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        return {
          date: formattedDate,
          name: setlistItem.name,
          venue: setlistItem.venue,
          city: setlistItem.city,
          state: setlistItem.state,
          country: setlistItem.country,
          setlist_link: setlistItem.url
        };
      });
      setConcerts(alldata);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch concert data:', error);
    }
  };

  const getMbid = async (page) => {
    try {
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
    setSearchTriggered(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getMbid(page);
    scrollToTop();
  };

  const scrollToTop = () => {
    document.documentElement.scrollTop = 0;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    if (totalPages === 1) {
      pages.push(
        <IconButton key={1} onClick={() => handlePageChange(1)} disabled={currentPage === 1} sx={{ fontSize: 'large' }}>
          {1}
        </IconButton>
      );
    } else {
      if (startPage > 1) {
        pages.push(
          <IconButton key={1} onClick={() => handlePageChange(1)} sx={{ fontSize: 'large' }}>
            {1}
          </IconButton>
        );
        if (startPage > 2) {
          pages.push(
            <IconButton key="ellipsis1" disabled>
              <Typography>...</Typography>
            </IconButton>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <IconButton key={i} onClick={() => handlePageChange(i)} disabled={i === currentPage} sx={{ fontSize: 'large' }}>
            {i}
          </IconButton>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <IconButton key="ellipsis2" disabled>
              <Typography>...</Typography>
            </IconButton>
          );
        }
        pages.push(
          <IconButton key={totalPages} onClick={() => handlePageChange(totalPages)} sx={{ fontSize: 'large' }}>
            {totalPages}
          </IconButton>
        );
      }
    }

    return pages;
  };

  return (
    <MainCard title="" sx={{ maxWidth: 2100, marginRight: 'auto', width: '100%' }}>
      <CardContent style={{ minHeight: 1000 }}>
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Search Concerts
        </Typography>
        <Box height={20} />
        <Divider variant="middle" />
        <Box height={20} />

        <Grid container justifyContent="center" alignItems="center" spacing={1}>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Enter Artist Name"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              fullWidth
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} aria-label="search">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {concerts.length > 0 && (
              <>
                {concerts.map((concert, index) => (
                  <StyledCardContent key={index}>
                    <Typography variant="subtitle1">Date: {concert.date}</Typography>
                    <Typography variant="subtitle1">Artist: {concert.name}</Typography>
                    <Typography variant="subtitle1">Venue: {concert.venue}</Typography>
                    <Typography variant="subtitle1">Location: {`${concert.city}, ${concert.state}, ${concert.country}`}</Typography>
                    <Typography variant="subtitle1">
                      Setlist:
                      <a href={concert.setlist_link} target="_blank" rel="noopener noreferrer">
                        {concert.setlist_link}
                      </a>
                    </Typography>
                  </StyledCardContent>
                ))}
              </>
            )}

            {artistName && totalPages > 1 && (
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <IconButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ArrowBackIos />
                  </IconButton>
                </Grid>
                <Grid item>
                  <div style={{ display: 'flex', alignItems: 'center' }}>{renderPageNumbers()}</div>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <ArrowForwardIos />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default ConcertPage;
