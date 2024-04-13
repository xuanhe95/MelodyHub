// ConcertPage.js

import React from 'react';
import { CardContent, Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult'; // 导入新的搜索结果组件

const ConcertPage = () => (
  <MainCard title="Concert Search">
    <CardContent>
      <Grid container spacing={2}>
        {/* Search Bar */}
        <Grid item xs={8}>
          <SearchBar />
        </Grid>

        {/* Search Results */}
        <Grid item xs={8}>
          <SearchResult /> {/* 使用新的搜索结果组件 */}
        </Grid>
      </Grid>
    </CardContent>
  </MainCard>
);

export default ConcertPage;
