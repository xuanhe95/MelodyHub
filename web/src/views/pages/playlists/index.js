// material-ui
import { Typography, CardContent, Button, Box, Divider } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';


// material-ui

import MusicTable from './MusicTable';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../../config.json';


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
  const [pokemon, setPokemon] = useState(false); // state to show pokemon display
  //const [showPokemonButton, setShowPokemonButton] = useState(true);  // State to manage button visibility

  useEffect(() => {
    // Reset the Pokemon state to hide any previously shown Pokemon
    setPokemon(null);

    const fetchPlaylistData = async () => {
      const playlistData = await fetchPlaylist(id);
      setPlaylist(playlistData);
    };
    fetchPlaylistData();
  }, [id]);

  const fetchPokemon = async () => {
    try {
      const tokenObj = JSON.parse(localStorage.getItem('token'));
      const token = tokenObj?.token;

      if (!token) {
        console.error('Token is null');
        return;
      }

      const requestOptions = {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      };
      // /pokemon/:playlistId
      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/pokemon/${id}`, requestOptions)
      
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon: ${response.statusText}');
      }
      const data = await response.json();
      console.log("Fetched Pokémon Data:", data);  
      setPokemon(data);
      //setShowPokemonButton(false); 

    } catch (error) {
      console.error('Failed to fetch Pokemon:', error);
    }
  };

  // Function to handle page click to hide Pokémon
  //const handlePageClick = () => {
  //  setPokemon(null);
  //};

  if (!playlist) {
    return (
      <MainCard title="Loading Playlist...">
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
      <MainCard title= "Playlists">
        <CardContent>
          <Typography variant="h2" style={{ fontSize: '4rem' }}>
            {playlist.name}
          </Typography>
          <Box height={10} />
          <Typography variant="body2">{playlist.year}</Typography>
          <Box height={10} />
          <Divider variant="middle" />
          <Box height={10} />
          <MusicTable playlist={playlist.playlistSongs} />
          <Box height={10} />
          <Button variant="contained" onClick={fetchPokemon}>
              Show Pokémon
          </Button>
          {pokemon && (
            <Box>
              <img src={pokemon.image_url} alt="Pokémon" style={{ width: '4rm', height: '3rm' }} />
            </Box>
          )}
          
        </CardContent>
      </MainCard>
    );
  }
};
export default PlaylistsPage;
