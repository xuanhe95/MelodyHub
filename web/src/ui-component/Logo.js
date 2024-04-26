// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

// ==============================|| LOGO TEXT ||============================== //

const Logo = () => {
  const theme = useTheme();

  // Optional: Define styles
  const logoStyle = {
    color: theme.palette.secondary.main, // Use theme color
    fontSize: '24px', // Set font size
    fontWeight: 'bold', // Make it bold
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <Typography style={logoStyle}>
      <LibraryMusicIcon style={{ marginRight: '4px' }} /> MELODY
    </Typography>
  );
};

export default Logo;
