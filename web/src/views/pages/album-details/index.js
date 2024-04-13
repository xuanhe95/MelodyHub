import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {IconArrowLeft} from '@tabler/icons-react';
import { Typography, CardContent, Button, Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';
import { Divider, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import config from '../../../config.json';

const AlbumDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve the album ID from the URL
  const [songs, setSongs] = useState([]); // State to hold song details
  const [album, setAlbum] = useState([]); // State to hold album

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/details/${id}/tracks`);
        const data = await response.json();

      // Convert all date strings in the response data to 'YYYY-MM-DD' format
      const updatedData = data.map(song => ({
        ...song,
        release_date: song.release_date.split('T')[0] // Splits the ISO string and takes the first part ('YYYY-MM-DD')
      }));

        setSongs(updatedData); // Assuming the response contains an array of song details
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      }
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

    fetchAlbum();
    fetchSongs();
  }, [id]); // Dependency array ensures this effect runs whenever the `id` changes


  return (
    <MainCard>
      <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={() => navigate(-1)}>Back</Button>
      <CardContent>
        <Typography variant="h1" style={{ fontSize: '5rem' }}>
          {album.name}
        </Typography>
        <Box height={20} />
        <Typography variant="body2">
          Artist Name Here
        </Typography>
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
            {songs.map((music, index) => (
              <TableRow key={index}>
                <TableCell colSpan={1}>
                  <Typography variant="body1">{music.title}</Typography>
                </TableCell>
                <TableCell colSpan={1}>{music.release_date}</TableCell>
                <TableCell colSpan={1}>{music.tempo}</TableCell>
                <TableCell>{music.energy}</TableCell>
                <TableCell>{music.danceability}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </CardContent>
    </MainCard>
  );
  };

export default AlbumDetailsPage;
