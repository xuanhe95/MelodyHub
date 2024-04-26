import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardMedia, Typography, CardContent, Pagination, Divider, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import config from '../../../config.json';

const AlbumPage = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(18); // 例如，每页显示10个专辑
  const [totalPages, setTotalPages] = useState(0);
  // const [selectedAlbum, setSelectedAlbum] = useState(null);
  // const [tracks, setTracks] = useState([]);

  const defaultImageUrl = 'https://files.readme.io/f2e91bb-portalDocs-sonosApp-defaultArtAlone.png';
  const loadingImageUrl =
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExczU2djFpdWNyZ3RheWVjankzdHc0M3RlMDYwNTc2MGRhanNpbXgzOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JFTg9PBtHZz9hHRkBN/giphy.gif';

  const fetchAlbums = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };

      const placeholderAlbums = Array.from({ length: 18 }).map((_, index) => ({
        album_id: `placeholder-${index}`,
        name: 'Loading...',
        imageUrl: loadingImageUrl
      }));

      setAlbums(placeholderAlbums);

      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/api/albums/pages?page=${page}&limit=${limit}`,
        requestOptions
      );

      // const anotherresponse = await fetch(`https://api.setlist.fm/rest/1.0/artist/20244d07-534f-4eff-b4d4-930878889970/setlists?p=1`, {
      //   method: 'GET',
      //   headers: {
      //     'x-api-key': '5ubATn-IrvFIN31uEeFe-bPZw7EKBTaxpQYs',
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json'
      //   }
      // });

      // console.log(anotherresponse);

      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();

      setTotalPages(data.totalPages);
      updateAlbumImages(data.albums.slice(0, 18), setAlbums);
      // setAlbums(data.slice(0, 36));
      // setLoading(false);
    } catch (error) {
      setError(error.message);
      // setLoading(false);
      console.error('Failed to fetch albums:', error);
    }
  };

  const updateAlbumImages = async (inputAlbums, setAlbumState, maxRetries = 5, retryDelay = 200) => {
    // 首先设置所有图片为加载中的图片
    setAlbumState(inputAlbums.map((album) => ({ ...album, imageUrl: loadingImageUrl })));

    inputAlbums.forEach(async (album, index) => {
      let retries = 0;
      const loadAlbumImage = async () => {
        try {
          console.log('Fetching image for album:', album.id);

          if (
            albums[index] &&
            albums[index].imageUrl &&
            albums[index].imageUrl !== loadingImageUrl &&
            albums[index].imageUrl !== defaultImageUrl
          ) {
            console.log('Skipping album:', album.id, 'as it already has an image');
            return;
          }

          const imgResponse = await fetch(`http://${config.server_host}:${config.server_port}/api/albums/details/${album.id}/image`);
          if (!imgResponse.ok) throw new Error(`Failed to fetch image for album: ${album.id}`);
          const imgData = await imgResponse.json();
          if (!imgData.imageUrl && retries < maxRetries) {
            retries++;
            console.log(`Retrying to fetch image for album: ${album.id}, attempt ${retries}`);
            //loadAlbumImage(); // 重新尝试加载图片
            if (retries > 4) {
              setTimeout(loadAlbumImage, retryDelay); // 延迟一段时间后重新尝试加载图片
            } else if (retries > 2) {
              setTimeout(loadAlbumImage, retryDelay / 2); // 延迟一段时间后重新尝试加载图片
            } else {
              setTimeout(loadAlbumImage, retryDelay / 4); // 延迟一段时间后重新尝试加载图片
            }
            return;
          }

          setAlbumState((prevAlbums) =>
            prevAlbums.map((item) => (item.id === album.id ? { ...item, imageUrl: imgData.imageUrl || defaultImageUrl } : item))
          );
          console.log('set album image' + imgData.imageUrl || defaultImageUrl);
        } catch (error) {
          console.error('Failed to fetch image for album:', album.id, error);
          if (retries < maxRetries) {
            retries++;
            console.log(`Retrying to fetch image for album: ${album.id}, attempt ${retries}`);
            //loadAlbumImage(); // 重新尝试加载图片
            setTimeout(loadAlbumImage, retryDelay); // 延迟一段时间后重新尝试加载图片
          } else {
            setAlbumState((prevAlbums) => prevAlbums.map((item) => (item.id === album.id ? { ...item, imageUrl: defaultImageUrl } : item)));
          }
        }
      };

      loadAlbumImage(); // 初始尝试加载图片
    });
  };

  // const handleLimitChange = (event) => {
  //   setLimit(parseInt(event.target.value, 10));
  //   setPage(1);  // 重置到第一页，因为数据的分页结构已改变
  // };

  const handlePageChange = (event, value) => {
    setAlbums([]);
    console.log(value);
    console.log('albums' + albums.length);
    setPage(value);
  };

  useEffect(() => {
    fetchAlbums();
  }, [page, limit]);

  const handleAlbumClick = async (album) => {
    navigate(`/album/details/${album.id}`);
  };

  return (
    <MainCard sx={{ maxWidth: 2100, marginRight: 'auto', width: '100%' }}>
      <CardContent>
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Albums
        </Typography>
        <Box height={20} />
        <Divider variant="middle" />
        <Box height={20} />
        <Grid container spacing={2}>
          {albums.map((album) => (
            <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={String(album.album_id)}>
              <Card>
                <CardActionArea onClick={() => handleAlbumClick(album)}>
                  <CardMedia component="img" height="auto" image={album.imageUrl} alt={album.name} />
                  <Typography variant="h6" component="div" style={{ padding: '8px' }}>
                    {album.name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Pagination
          count={totalPages} // 总页数
          page={page} // 当前页码
          onChange={handlePageChange} // 页码改变时的处理函数
          color="primary" // 颜色主题
          sx={{ marginTop: 2, marginBottom: 2, display: 'flex', justifyContent: 'center' }} // 样式
        />

        {/* {loading && <p>Loading...</p>} */}
        {error && <p>Error: {error}</p>}
      </CardContent>
    </MainCard>
  );
};
export default AlbumPage;
