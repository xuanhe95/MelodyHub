import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IconArrowLeft } from '@tabler/icons-react';
import { Typography, CardContent, Button, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress } from '@mui/material';
import { IconUser } from '@tabler/icons-react';
import { Divider, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import config from '../../../config.json';

const AlbumDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve the album ID from the URL
  const [songs, setSongs] = useState([]); // State to hold song details
  const [album, setAlbum] = useState([]); // State to hold album
  const [artists, setArtists] = useState([]); // State to hold artists
  const [songsFetchingDone, setSongsFetchingDone] = useState(true); // State to track loading status
  const [artistsFetchingDone, setArtistsFetchingDone] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchSongs = async () => {
      setSongsFetchingDone(false);
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/details/${id}/tracks`);
        const data = await response.json();

        // Convert all date strings and decimal fields in the response data to appropriate formats
        const updatedData = data.map((song) => ({
          ...song,
          release_date: song.release_date.split('T')[0], // Splits the ISO string and takes the first part ('YYYY-MM-DD')
          tempo: parseFloat(song.tempo).toFixed(3), // Formats tempo to three decimal places
          energy: parseFloat(song.energy).toFixed(3), // Formats energy to three decimal places
          danceability: parseFloat(song.danceability).toFixed(3) // Formats danceability to three decimal places, if you want to keep consistency
        }));

        setSongs(updatedData); // Assuming the response contains an array of song details
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      }

      setSongsFetchingDone(true);
    };

    const fetchAlbum = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/details/${id}`);
        const data = await response.json();

        setAlbum(data); // Assuming the response contains an array of song details
      } catch (error) {
        console.error('Failed to fetch album:', error);
      }
    };

    const fetchArtists = async () => {
      setArtistsFetchingDone(false);
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/api/artists/byalbum/${id}`);
        const data = await response.json();

        setArtists(data);
      } catch (error) {
        console.error('Failed to fetch artists:', error);
      }
      setArtistsFetchingDone(true);
    };

    fetchAlbum();
    fetchArtists();
    fetchSongs();
  }, [id]); // Dependency array ensures this effect runs whenever the `id` changes

  return (
    <MainCard>
      <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={() => navigate(-1)}>
        Back
      </Button>
      <CardContent>
        <Typography variant="h5" style={{ fontSize: '5rem' }}>
          {album.name}
        </Typography>
        <Box height={20} />
        {artistsFetchingDone ? (
          <Typography variant="subtitle1" color="text.secondary" style={{ fontSize: '2rem' }}>
            <IconUser size={'1.6rem'} style={{ marginRight: '0.3rem' }} />
            {artists.length > 0 ? artists[0].artist : 'Unknown Artist'}
          </Typography>
        ) : (
          <Typography variant="subtitle1" color="text.secondary" style={{ fontSize: '2rem' }}>
            <IconUser size={'1.6rem'} style={{ marginRight: '0.3rem' }} />
            <CircularProgress size={'1.6rem'} />
          </Typography>
        )}
        <Box height={20} />
        <Divider variant="middle" />
        <Box height={20} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={1}>
                <Typography variant="h3">Track</Typography>
              </TableCell>
              <TableCell colSpan={1}>
                <Typography variant="h3">Release Date</Typography>
              </TableCell>
              <TableCell colSpan={1}>
                <Typography variant="h3">Tempo</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h3">Energy</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h3">Danceability</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {songsFetchingDone ? (
              songs.map((music, index) => (
                <TableRow key={index}>
                  <TableCell>{music.title}</TableCell>
                  <TableCell>{music.release_date}</TableCell>
                  <TableCell>{music.tempo}</TableCell>
                  <TableCell>{music.energy}</TableCell>
                  <TableCell>{music.danceability}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </MainCard>
  );
};

export default AlbumDetailsPage;
