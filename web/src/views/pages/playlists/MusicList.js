import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Divider } from '@mui/material';

// 音乐列表数据
const musicList = [
  { title: 'Song 1', artist: 'Artist 1', album: 'Album 1', duration: '3:45' },
  { title: 'Song 2', artist: 'Artist 2', album: 'Album 2', duration: '4:20' },
  { title: 'Song 3', artist: 'Artist 3', album: 'Album 3', duration: '2:58' }
];

const MusicList = () => {
  musicList.map((music) => {
    console.log('music');
    console.log(music);
    console.log(music.title);
    console.log(music.artist);
    console.log(music.album);
  });
  return (
    <List>
      {/* 表头 */}
      <ListItem dense>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="subtitle1">Title</Typography>}
          secondary={<Typography variant="body2">Artist — Album — Danceability</Typography>}
        />
      </ListItem>
      {/* 音乐列表 */}
      {musicList.map((music, index) => (
        <React.Fragment key={index}>
          <ListItem dense alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={music.title} src="/path/to/music-avatar.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={music.title}
              secondary={
                <Typography component="span" variant="body2" color="textPrimary">
                  {music.artist} — {music.album.name} — {music.danceability}
                </Typography>
              }
            />
          </ListItem>
          {index < musicList.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default MusicList;
