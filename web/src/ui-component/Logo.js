// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// ==============================|| LOGO TEXT ||============================== //

const Logo = () => {
    const theme = useTheme();

    // Optional: Define styles
    const logoStyle = {
        color: theme.palette.primary.main, // Use theme color
        fontSize: '24px', // Set font size
        fontWeight: 'bold', // Make it bold
        display: 'flex',
        alignItems: 'center'
    };

    return (
        <Typography style={logoStyle}>
            Melody 🎵
        </Typography>
    );
};

export default Logo;
