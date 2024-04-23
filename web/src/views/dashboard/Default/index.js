import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress } from '@mui/material';
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
      <MainCard title="Rising Stars">
        <Grid container justifyContent="center" alignItems="center" style={{ height: '450px' }}>
          <CircularProgress />
        </Grid>
      </MainCard>
    );
  }

  return (
    <MainCard title="Rising Stars">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={artists} margin={{ top: 20, right: 50, left: 20, bottom: 110 }}>
              <XAxis dataKey="name" angle={45} interval={0} textAnchor="start"></XAxis>
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="Improvement_Score" fill="#8884d8" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default DashboardPage;
