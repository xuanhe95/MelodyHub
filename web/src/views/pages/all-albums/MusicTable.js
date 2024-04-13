import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Typography, Avatar } from '@mui/material';

const musicList = [
  { title: 'Song 1', artist: 'Artist 1', album: 'Album 1', duration: '3:45' },
  { title: 'Song 2', artist: 'Artist 2', album: 'Album 2', duration: '4:20' },
  { title: 'Song 3', artist: 'Artist 3', album: 'Album 3', duration: '2:58' },
  { title: 'Song 4', artist: 'Artist 4', album: 'Album 4', duration: '5:12' },
  { title: 'Song 5', artist: 'Artist 5', album: 'Album 5', duration: '3:30' }
];

const MusicTable = () => {
  return (
    <Table>
      {/* 表头 */}
      <TableHead>
        <TableRow>
          <TableCell colSpan={1}>
            <Typography variant="h3">Track</Typography>
          </TableCell>
          <TableCell colSpan={1}>
            <Typography variant="h3">Artist</Typography>
          </TableCell>
          <TableCell colSpan={1}>
            <Typography variant="h3">Album</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="h3">Duration</Typography>
          </TableCell>
        </TableRow>
      </TableHead>

      {/* 表格内容 */}
      <TableBody>
        {musicList.map((music, index) => (
          <TableRow key={index}>
            <TableCell colSpan={1}>
              <Avatar alt={music.title} src="/path/to/music-icon.jpg" />
              <Typography variant="body1">{music.title}</Typography>
            </TableCell>
            <TableCell colSpan={1}>{music.artist}</TableCell>
            <TableCell colSpan={1}>{music.album}</TableCell>
            <TableCell>{music.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MusicTable;
