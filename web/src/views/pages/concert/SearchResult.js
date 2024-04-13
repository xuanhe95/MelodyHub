// SearchResult.js

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const SearchResult = () => {
  // 假设这是搜索结果数据
  const searchResults = [
    { date: '2024-05-01', location: 'Concert Hall', performer: 'Artist A', setlist: ['Song 1', 'Song 2', 'Song 3'] },
    { date: '2024-05-15', location: 'Outdoor Stadium', performer: 'Artist B', setlist: ['Song 4', 'Song 5', 'Song 6'] }
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Performer</TableCell>
            <TableCell>Setlist</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.date}</TableCell>
              <TableCell>{result.location}</TableCell>
              <TableCell>{result.performer}</TableCell>
              <TableCell>{result.setlist.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchResult;
