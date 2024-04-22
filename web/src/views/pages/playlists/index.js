// material-ui
import { Typography, CardContent } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { Divider, Box } from '@mui/material';

// material-ui

import MusicTable from './MusicTable';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import config from '../../../config.json';

// ==============================|| SAMPLE PAGE ||============================== //

async function fetchPlaylist(id) {
  try {
    const tokenObj = JSON.parse(localStorage.getItem('token'));
    const token = tokenObj?.token;

    if (!token) {
      console.error('Token is null');
      return null;
    }

    const requestOptions = {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
    console.log("id");
    console.log(id);
    const response = await fetch(`http://${config.server_host}:${config.server_port}/api/playlists/${id}`, requestOptions);

    if (!response.ok) {
      console.error('Failed to fetch playlist:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error during fetching playlist:', error);
    return null;
  }
}

const PlaylistsPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      const playlistData = await fetchPlaylist(id);
      setPlaylist(playlistData);
    };
    fetchPlaylistData();
  }, [id]);

  if (!playlist) {
    return (
      <MainCard title="Playlists">
        <CardContent>
          <Typography variant="h1" style={{ fontSize: '5rem' }}>
            Wait a moment...
          </Typography>
          <Box height={20} />
          <Typography variant="body2">
            Loading
          </Typography>
          <Box height={20} />
          <Divider variant="middle" />
          <Box height={20} />
          <MusicTable />
        </CardContent>
      </MainCard>
    );
  } else {
    console.log(playlist);
    return (
      <MainCard title="Playlists">
        <CardContent>
          <Typography variant="h1" style={{ fontSize: '5rem' }}>
            {playlist.name}
          </Typography>
          <Box height={20} />
          <Typography variant="body2">{playlist.year}</Typography>
          <Box height={20} />
          <Divider variant="middle" />
          <Box height={20} />
          <MusicTable playlist={playlist.playlistSongs} />
        </CardContent>
      </MainCard>
    );
  }
};
export default PlaylistsPage;
