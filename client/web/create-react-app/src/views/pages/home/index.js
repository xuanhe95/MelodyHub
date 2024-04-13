import React, { useState } from 'react';
import { Grid, Card, CardActionArea, CardMedia, Collapse, List, ListItem, ListItemText } from '@mui/material';

// material-ui
import { Typography, CardContent } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import { Divider, Box } from '@mui/material';

const AlbumPage = () => {
  // 将 selectedAlbum 状态移出组件外部
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // 假设这是你的专辑数据
  const albums = [
    { id: 1, title: 'Album 1', cover: 'cover1.jpg', songs: ['Song 1', 'Song 2'] },
    { id: 2, title: 'Album 2', cover: 'cover2.jpg', songs: ['Song 4', 'Song 5', 'Song 6'] },
    { id: 3, title: 'Album 3', cover: 'cover3.jpg', songs: ['Song 7', 'Song 8', 'Song 9'] },
    { id: 4, title: 'Album 4', cover: 'cover4.jpg', songs: ['Song 10', 'Song 11', 'Song 12'] },
    { id: 5, title: 'Album 5', cover: 'cover5.jpg', songs: ['Song 13', 'Song 14', 'Song 15'] }
    // 其他专辑...
  ];

  // 处理专辑点击事件
  const handleAlbumClick = (album) => {
    setSelectedAlbum(selectedAlbum === album ? null : album);
  };

  return (
    <MainCard title="">
      <CardContent>
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Popular
        </Typography>
        <Box height={20} />
        <Grid container spacing={3}>
          {albums.map((album) => (
            <Grid item xs={6} sm={4} md={2} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="180" image={album.cover} alt={album.title} />
                </CardActionArea>
                {selectedAlbum && selectedAlbum.id === album.id && (
                  <Collapse in={true}>
                    <List>
                      {album.songs.map((song, songIndex) => (
                        <ListItem key={songIndex}>
                          <ListItemText primary={song} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box height={20} />
        <Divider variant="middle" />
        <Box height={50} />
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Favorite
        </Typography>
        <Box height={20} />
        <Grid container spacing={3}>
          {albums.map((album) => (
            <Grid item xs={6} sm={4} md={2} key={album.id}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="180" image={album.cover} alt={album.title} />
                </CardActionArea>
                {selectedAlbum && selectedAlbum.id === album.id && (
                  <Collapse in={true}>
                    <List>
                      {album.songs.map((song, songIndex) => (
                        <ListItem key={songIndex}>
                          <ListItemText primary={song} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default AlbumPage;
