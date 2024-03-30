// material-ui
import { Typography, CardContent } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import {Divider, Box} from '@mui/material';

// material-ui

import MusicTable from './MusicTable';

// ==============================|| SAMPLE PAGE ||============================== //

const AlbumsPage = () => (
  <MainCard title="Albums">
    <CardContent>


    <Typography variant="h1" style={{fontSize: '5rem'}}>
      Name Of the Album
    </Typography>
    <Box height={20}/>
    <Typography variant="body2">
      Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif ad
      minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in reprehended
      in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa qui officiate
      descent molls anim id est labours.
    </Typography>
    <Box height={20}/>
    <Divider variant="middle" />
    <Box height={20}/>
    <MusicTable/>
    </CardContent>
  </MainCard>

);

export default AlbumsPage;
