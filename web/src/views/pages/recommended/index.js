import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config.json';
import ShuffleIcon from '@mui/icons-material/Shuffle';
// material-ui
import MainCard from 'ui-component/cards/MainCard';

import { Typography, CardContent, Button, Table, TableHead, TableRow, TableCell, Box, Divider } from '@mui/material';

// project imports
// import MainCard from 'ui-component/cards/MainCard';

// import { Divider, Box } from '@mui/material';

// // material-ui

// import MusicTable from './MusicTable';

// ==============================|| SAMPLE PAGE ||============================== //

const RecommendedPage = () => {
  const navigate = useNavigate();

  const handleAlbumClick = async (album) => {
    navigate(`/album/random/${album.album_id}`);
  };

  const jump = async () => {
    try {
      // 异步操作
      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/random/1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const album = data[0];
        console.log('Jumping to album:', album);
        await handleAlbumClick(album);
      } else {
        console.error('No album data found.');
      }
    } catch (error) {
      console.error('Error fetching album data:', error);
    }
  };

  // 在组件挂载时执行跳转逻辑
  useEffect(() => {
    jump();
  }, []); // 注意第二个参数是一个空数组，表示该副作用只会在组件挂载时执行一次

  return (
    <MainCard>
      <Button variant="outlined" startIcon={<ShuffleIcon />}>
        Shuffle
      </Button>
      <CardContent>
        <Typography variant="h5" style={{ fontSize: '5rem' }}>
          {'Wait for a moment...'}
        </Typography>
        <Box height={20} />
        <Typography variant="body2">Artist Name Here</Typography>
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

          {/* <TableBody>
            {songsFetchingDone ? (
              songs.map((music, index) => (
                <TableRow key={index}>
                  <TableCell>{""}</TableCell>
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
          </TableBody> */}
        </Table>
      </CardContent>
    </MainCard>
  );
};

export default RecommendedPage;
