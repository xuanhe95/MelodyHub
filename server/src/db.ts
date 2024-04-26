import { DataSource } from 'typeorm';
import config from './config';
import { User } from './entity/user'; // Import your entities
import { Album } from './entity/album';
import { Track } from './entity/track';
import { Artist } from './entity/artist';
import { Concert } from './entity/concert';
import { ReleaseBy } from './entity/releaseBy';
import { Playlist } from './entity/playlist';
import { ArtistGenre } from './entity/artistGenre';
import { PlaylistSong } from './entity/playlistSong';
import { SongRanking } from './entity/songRanking';
import { TopSongByCountry } from './entity/TopSongByCountry';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.rds_host,
    port: config.rds_port,
    username: config.rds_user,
    password: config.rds_password,
    database: config.rds_db,
    entities: [
        User,
        Album,
        Track,
        Artist,
        ArtistGenre,
        ReleaseBy,
        Concert,
        Playlist,
        PlaylistSong,
        SongRanking,
        TopSongByCountry,        
    ],
    synchronize: false, // dev stage
});

export const initializeDatabase = async () => {
    await AppDataSource.initialize();
};