// material-ui
import { Typography, CardContent, Button, Box, Divider, CircularProgress } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
// project imports
import MainCard from 'ui-component/cards/MainCard';

// material-ui

import MusicTable from './MusicTable';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../../config.json';

const defaultImg =
  'https://th.bing.com/th/id/R.f72528eb55f0dc1ac9e1bdf48b03d0f3?rik=NJGOijjpUROlRg&riu=http%3a%2f%2fwww.ssbwiki.com%2fimages%2f1%2f1c%2fPokemonSymbol(preBrawl).svg&ehk=3nGfK63BmcszAur%2f%2bq8EYMsHW0uj3zReHU3drCYvG%2bo%3d&risl=&pid=ImgRaw&r=0';
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
    console.log('id');
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
    // reset pokemon state when playlist changes
    setPokemon(null);

    const fetchPlaylistData = async () => {
      const playlistData = await fetchPlaylist(id);
      setPlaylist(playlistData);
      setPokemon({ image_url: defaultImg });
      // // 获取 Playlist 之后立即获取 Pokémon 数据
      // if (playlistData) {
      //   fetchPokemon(); // 调用 fetchPokemon 函数
      // }
    };
    fetchPlaylistData();
  }, [id]); // id 更改时重新执行

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
      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/pokemon/${id}`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon: ${response.statusText}');
      }
      const data = await response.json();
      console.log('Fetched Pokémon Data:', data);
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
        <CardContent style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', minHeight: '900px' }}>
          <Box height={20} />
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" style={{ fontSize: '1.5rem', marginTop: '20px' }}>
              Loading playlist...
            </Typography>
          </Box>
        </CardContent>
      </MainCard>
    );
  } else {
    console.log(playlist);
    return (
      <MainCard title="Playlists">
        <CardContent>
          {/* <Typography variant="h2" style={{ fontSize: '4rem' }}>
            {playlist.name}
          </Typography> */}
          <div className="container" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box flexGrow={1} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Typography variant="h2" style={{ fontSize: '4rem' }}>
                {playlist.name}
              </Typography>
            </Box>
            <Box>
              {pokemon ? (
                <Box style={{ width: '25rem', height: '25rem' }}>
                  <img src={pokemon.image_url} alt="Pokémon" style={{ width: '25rem', height: '25rem' }} />
                </Box>
              ) : (
                <Box style={{ width: '25rem', height: '25rem', backgroundColor: '#ffffff' }}> {/* 占位符的背景色可以根据需要调整 */}</Box>
              )}
              <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button variant="contained" onClick={fetchPokemon}>
                  <CatchingPokemonIcon />
                  &nbsp;Get new Pokémon!
                </Button>
              </Box>
            </Box>
          </div>

          <Box style={{ clear: 'both' }}>
            {' '}
            {/* 使用 clear:both 清除浮动影响 */}
            <Typography variant="body2">{playlist.year}</Typography>
            <Box height={10} />
            <Divider variant="middle" />
            <Box height={10} />
            <Box height={10} />
            <MusicTable playlist={playlist.playlistSongs} />
            <Box height={10} />
          </Box>
        </CardContent>
      </MainCard>
    );
  }
};
export default PlaylistsPage;
