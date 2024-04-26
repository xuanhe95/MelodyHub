import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Typography, Avatar, Box } from '@mui/material';

// const musicList = [
//   { title: 'Song 1', artist: 'Artist 1', album: 'Album 1', duration: '3:45' },
//   { title: 'Song 2', artist: 'Artist 2', album: 'Album 2', duration: '4:20' },
//   { title: 'Song 3', artist: 'Artist 3', album: 'Album 3', duration: '2:58' },
//   { title: 'Song 4', artist: 'Artist 4', album: 'Album 4', duration: '5:12' },
//   { title: 'Song 5', artist: 'Artist 5', album: 'Album 5', duration: '3:30' }
// ];

const MusicTable = ({ playlist }) => {
  console.log(playlist);
  if (!playlist) {
    return <Typography variant="h3">Loading...</Typography>;
  }

  playlist.map((music) => {
    const date = new Date(music.track.release_date);
    const year = date.getFullYear();
    music.year = year;
  });

  return (
    <Table>
      {/* 表头 */}
      <TableHead>
        <TableRow>
          <TableCell colSpan={1}>
            <Typography variant="h3">Track</Typography>
          </TableCell>
          <TableCell colSpan={1}>
            <Typography variant="h3">Album</Typography>
          </TableCell>
          <TableCell colSpan={1}>
            <Typography variant="h3">Artist</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="h3">Year</Typography>
          </TableCell>
        </TableRow>
      </TableHead>

      {/* 表格内容 */}
      <TableBody>
        {playlist.map((music, index) => (
          <TableRow key={index}>
            <TableCell colSpan={1}>
              <Box display="flex" alignItems="center">
                {' '}
                {/* 使用flex布局并垂直居中对齐 */}
                <Avatar alt={music.track.title} src="/path/to/music-icon.jpg" sx={{ mr: 2 }} /> {/* marginRight添加一些间隔 */}
                <Typography variant="body1">{music.track.title}</Typography>
              </Box>
            </TableCell>
            <TableCell colSpan={1}>{music.track.album.name}</TableCell>
            <TableCell colSpan={1}>{music.artist.name}</TableCell>

            <TableCell>{music.year}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MusicTable;
