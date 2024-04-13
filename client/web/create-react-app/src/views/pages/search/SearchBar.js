import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search…"
        variant="outlined"
        size="large"
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton type="submit" edge="end" aria-label="search">
              <SearchIcon />
            </IconButton>
          )
        }}
      />
    </form>
  );
};

export default SearchBar;
