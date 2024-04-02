import { DataSource, In, Repository } from 'typeorm';
import { AppDataSource } from '../db';
import { Playlist } from '../entity/playlist';
import { Track } from '../entity/track';
import { PlaylistSong } from '../entity/playlistSong';
import { UserService } from './userService';
import { Artist } from '../entity/artist';

export class PlaylistService {
    private dataSource: DataSource;
    private userService: UserService;
    private playlistRepository: Repository<Playlist>;

    constructor(dataSource: DataSource, userService: UserService) {
        this.dataSource = dataSource;
        this.playlistRepository = this.dataSource.getRepository(Playlist);
        this.userService = userService;
    }

    // Find a playlist by ID
    async findPlaylistById(playlistId: string): Promise<Playlist | null> {
        return this.playlistRepository.findOne({
            where: { playlist_id: playlistId },
            relations: ['playlistSongs', 'playlistSongs.track'], // Adjust based on your entity relationships
        });
    }

    // List all playlists
    async listAllPlaylists(): Promise<Playlist[]> {
        return this.playlistRepository.find({
            relations: ['playlistSongs', 'playlistSongs.track'], // Include tracks in the response
        });
    }

    // Find playlists for a specific user
    async findPlaylistsByUser(userId: number): Promise<Playlist[]> {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        return this.playlistRepository.find({
            where: { user: user },
            relations: ['playlistSongs', 'playlistSongs.track'], // Include tracks in the response
        });
    }
    
    async generatePlaylistBasedOnTrack(songId: string, userId: number): Promise<Playlist> {
        const relatedTracks = await this.dataSource.query(
            `SELECT t.id, t.name, COUNT(*) AS appearance_count
            FROM PLAYLIST_SONGS ps
            JOIN SONGS t ON ps.song_id = t.id
            WHERE ps.playlist_id IN (
                SELECT playlist_id FROM PLAYLIST_SONGS WHERE song_id = ?
            )
            AND t.id != ?
            GROUP BY t.id, t.name
            ORDER BY appearance_count DESC
            LIMIT 10;`,
            [songId, songId]
        );

        // Retrieve user using UserService
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Create a new playlist
        const newPlaylist = new Playlist();
        newPlaylist.name = `Generated Playlist based on Song ${songId}`;
        newPlaylist.user = user; // This assumes that the Playlist entity has a 'user' relationship
        await this.dataSource.manager.save(newPlaylist);

        // Add related tracks to the new playlist
        for (const track of relatedTracks) {
            const trackEntity = await this.dataSource.manager.findOne(Track, { where: { id: track.id } });
            if (!trackEntity) {
                throw new Error(`Track with ID ${track.id} not found`);
            }

            const playlistSong = new PlaylistSong();
            playlistSong.playlist = newPlaylist;
            playlistSong.track = trackEntity;
            await this.dataSource.manager.save(playlistSong);
        }

        return newPlaylist;
    }

    async addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void> {
        // Use helper method to retrieve playlist
        const playlist = await this.findPlaylistById(playlistId);
        if (!playlist) {
            throw new Error(`Playlist with ID ${playlistId} not found`);
        }

        const tracks = await this.dataSource.manager.findBy(Track, { id: In(trackIds) });

        for (const track of tracks) {
            const playlistSong = new PlaylistSong();
            playlistSong.playlist = playlist;
            playlistSong.track = track;
            await this.dataSource.manager.save(playlistSong);
        }
    }

    // Method to find all songs in a playlist for a specific year
    async findSongsInPlaylistForYear(year: string): Promise<Track[]> {
        const tracks = await this.dataSource.query(
            `SELECT S.*
            FROM PLAYLIST_SONGS P
            JOIN SONGS S ON P.song_id = S.id
            WHERE P.year = ?`,
            [year]
        );
        return tracks;
    }

    // Method to find the most featured artist in playlists
    async findMostFeaturedArtistInPlaylists(): Promise<Artist[]> {
        const artists = await this.dataSource.query(
            `SELECT A.*, COUNT(DISTINCT P.playlist_id) AS PlaylistAppearances
            FROM PLAYLIST_SONGS P
            JOIN RELEASE_BY R ON P.song_id = R.song_id
            JOIN ARTISTS A ON R.artist_id = A.artist_id
            GROUP BY A.artist
            ORDER BY PlaylistAppearances DESC;`
        );
        return artists;
    }
}



