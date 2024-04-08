import { DataSource, In, Repository } from 'typeorm';
import { AppDataSource } from '../db';
import { Playlist } from '../entity/playlist';
import { Track } from '../entity/track';
import { PlaylistSong } from '../entity/playlistSong';
import { UserService } from './userService';
import { Artist } from '../entity/artist';
import { User } from '../entity/user';
import { v4 as uuidv4 } from 'uuid';
import { ReleaseBy } from '../entity/releaseBy';

export class PlaylistService {
    private dataSource: DataSource;
    private userService: UserService;
    private playlistRepository: Repository<Playlist>;

    constructor(dataSource: DataSource, userService: UserService) {
        this.dataSource = dataSource;
        this.playlistRepository = this.dataSource.getRepository(Playlist);
        this.userService = userService;
    }

    /**
     * Find a playlist by ID
     * @param playlistId 
     * @returns 
     */
    async findPlaylistById(playlistId: string): Promise<Playlist | null> {
        return this.dataSource.manager.findOne(Playlist, {
            where: { playlist_id: playlistId },
            relations: ['user'] // Include user in the response
        });
    }

    // List all playlists
    async listAllPlaylists(): Promise<Playlist[]> {
        return this.playlistRepository.find({
            relations: ['playlistSongs', 'playlistSongs.track'], // Include tracks in the response
        });
    }


    /**
     * Find playlists by user
     * @param userId 
     * @returns 
     */
    async findPlaylistsByUser(userId: number): Promise<Playlist[]> {
        // const user = await this.userService.getUserById(userId);
        // if (!user) {
        //     throw new Error(`User with ID ${userId} not found`);
        // }
        return this.playlistRepository.find({
            where: { user: { id: userId } },
            relations: ['playlistSongs', 'playlistSongs.track'],
        });
        
    }
    
    async generatePlaylistBasedOnTrackByAdminPlaylists(songId: string, userId: number): Promise<Playlist> {
        // Check if the song exists in any playlist first
        const songExistsInPlaylist = await this.dataSource.query(
            `SELECT 1 FROM PLAYLIST_SONGS WHERE song_id = ? LIMIT 1`,
            [songId]
        );

        // If the song is not found in any playlist, throw an error or handle accordingly
        if (songExistsInPlaylist.length === 0) {
            throw new Error('Song not found in any playlist');
        }

        // If the song exists in playlists, continue to generate the related tracks
        const relatedTracks = await this.dataSource.query(
            `SELECT ps2.song_id, COUNT(*) AS appearance_count
            FROM PLAYLIST_SONGS ps1
            JOIN PLAYLIST_SONGS ps2 ON ps1.playlist_id = ps2.playlist_id
            WHERE ps1.song_id = ? AND ps2.song_id != ?
            GROUP BY ps2.song_id
            ORDER BY appearance_count DESC
            LIMIT 10`,
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

    /**
     * Create a new playlist for a user
     * @param playlistName The name of the playlist
     * @param userId The ID of the user
     * @returns Promise<Playlist>
     * */

    // Method to create a new empty playlist for a user
    async createPlaylistForUser(playlistName: string, userId: number): Promise<Playlist> {
        // Retrieve the user based on userId
        const user = await this.dataSource.manager.findOneBy(User, { id: userId });
        console.log(user);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Create a new playlist instance
        const newPlaylist = new Playlist();

        // Generate a unique playlist ID
        newPlaylist.playlist_id = uuidv4(); // Assign a unique ID to the playlist
        newPlaylist.name = playlistName;
        newPlaylist.user = user; // Associate the user with the playlist
        newPlaylist.year = new Date().getFullYear();

        // Save the new playlist entity in the database
        await this.dataSource.manager.save(newPlaylist);

        return newPlaylist;
    }


    async addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void> {
        // Use helper method to retrieve playlist
        const playlist = await this.findPlaylistById(playlistId);
        if (!playlist) {
            throw new Error(`Playlist with ID ${playlistId} not found`);
        }

        // Retrieve all track entities based on the given track IDs
        const tracks = await this.dataSource.manager.findBy(Track, { id: In(trackIds) });

        // Iterate through each track and create a PlaylistSong association
        for (const track of tracks) {
            const playlistSong = new PlaylistSong();
            playlistSong.playlist = playlist;
            playlistSong.track = track;
            // Save the PlaylistSong entity, which links a track with the playlist
            await this.dataSource.manager.save(playlistSong);
        }
    }


    /**
     * Add a track to a playlist
     * @param playlistId The ID of the playlist
     * @param trackId The ID of the track
     * @returns Promise<void>
     **/

    async addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const playlist = await queryRunner.manager.findOneBy(Playlist, { playlist_id: playlistId });
            if (!playlist) {
                throw new Error(`Playlist with ID ${playlistId} not found`);
            }

            const track = await queryRunner.manager.findOneBy(Track, { id: trackId });
            if (!track) {
                throw new Error(`Track with ID ${trackId} not found`);
            }

            const releases = await queryRunner.manager.find(ReleaseBy, {
                where: { track: { id: trackId }},
                relations: ['artist']
            });


            const playlistSongs = releases.map(release => {
                const playlistSong = new PlaylistSong();
                playlistSong.playlist = playlist;
                playlistSong.track = track;
                playlistSong.year = playlist.year;
                console.log("artist", release.artist)
                playlistSong.artist = release.artist;
                return playlistSong;
            });

            if(playlistSongs.length > 0){
                await queryRunner.manager.save(PlaylistSong, playlistSongs);
                await queryRunner.commitTransaction();
            }
            else{
                console.log('No releases found for track:', track);
                await queryRunner.rollbackTransaction();
            }

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Transaction failed:', error);
            // 在这里可以抛出错误或返回错误信息，以便可以在调用该函数的地方处理
            throw error;
        } finally {
            await queryRunner.release();
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



    // async addPlaylistToUser(userId: number, playlistId: string): Promise<void> {
    //     // Retrieve the user entity
    //     const user = await this.userService.getUserById(userId);
    //     if (!user) {
    //         throw new Error(`User with ID ${userId} not found`);
    //     }

    //     // Retrieve the playlist entity
    //     const playlist = await this.findPlaylistById(playlistId);
    //     if (!playlist) {
    //         throw new Error(`Playlist with ID ${playlistId} not found`);
    //     }

    //     // Add the playlist to the user's playlists
    //     user.playlists.push(playlist);

    //     // Save the updated user entity
    //     await this.dataSource.manager.save(user);
    // }
}



