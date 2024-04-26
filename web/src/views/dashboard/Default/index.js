import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Box, Typography, Divider, CardContent } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import config from '../../../config.json';

function DashboardPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false); // 新增状态以跟踪数据加载情况
  useEffect(() => {
    async function fetchData() {
      setLoading(true); // 开始加载数据
      const data = await fetchRisingStars();
      setArtists(data || []);
      setLoading(false); // 数据加载完成
    }
    fetchData();
  }, []);

  const fetchRisingStars = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
      const response = await fetch(`http://${config.server_host}:${config.server_port}/api/artists/rising-stars`, requestOptions);
      const data = await response.json();

      //console.log("rising star:", data);

      if (!response.ok) {
        throw new Error('Failed to fetch rising stars data');
      }

      const artists = data.map((item) => ({
        //id: item.artist_id,
        name: item.artist,
        Improvement_Score: item.ImprovementScore
      }));

      return artists;
    } catch (error) {
      console.error('Error fetching rising stars data:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <MainCard title="" sx={{ maxWidth: 2100, marginRight: 'auto', width: '100%' }}>
        <CardContent>
          <Typography variant="h1" style={{ fontSize: '2rem' }}>
            Rising Stars
          </Typography>
          <Box height={20} />
          <Divider variant="middle" />
          <Box height={20} />
          <Grid container justifyContent="center" alignItems="center" style={{ height: '900px' }}>
            <CircularProgress />
          </Grid>
          <Typography variant="h6" align="center" style={{ fontSize: '1rem', fontWeight: 100 }}>
            A rising star is an artist that has shown a significant increase in average danceability of songs since 2015, indicating a shift
            towards potentially more engaging or commercially viable music.
          </Typography>
          <Box height={20} />
        </CardContent>
      </MainCard>
    );
  }

  return (
    <MainCard title="" sx={{ maxWidth: 2100, marginRight: 'auto', width: '100%' }}>
      <CardContent>
        <Typography variant="h1" style={{ fontSize: '2rem' }}>
          Rising Stars
        </Typography>
        <Box height={20} />
        <Divider variant="middle" />
        <Box height={20} />
        <Grid container spacing={3} style={{ height: '900px' }}>
          <Grid item xs={12}>
            <ResponsiveContainer width="100%" height={600}>
              <BarChart data={artists} margin={{ top: 18, right: 40, left: 18, bottom: 100 }}>
                <XAxis dataKey="name" angle={45} interval={0} textAnchor="start"></XAxis>
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="Improvement_Score" fill="#8884d8" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </Grid>

          <Grid item xs={12} style={{ height: '100px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h6" align="center" style={{ fontSize: '1rem', fontWeight: 100 }}>
                A rising star is an artist that has shown a significant increase in average danceability of songs since 2015, indicating a
                shift towards potentially more engaging or commercially viable music.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}

export default DashboardPage;
