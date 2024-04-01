import { AppDataSource } from '../db';
import { Playlist } from '../entity/playlist';
import { PlaylistSong } from '../entity/playlistSong';
import { User } from '../entity/user';
import { UserService } from './userService';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Track } from '../entity/track';

@Injectable()
export class PlaylistService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(Playlist)
        private playlistRepository: Repository<Playlist>,
        private userService: UserService, // Inject UserService
    ) {}

    async getAllPlaylistIds(): Promise<string[]> {
        const entityManager = AppDataSource.manager;
        const query = 'SELECT DISTINCT playlist_id FROM playlist_songs';
        const result = await entityManager.query(query);
        return result.map((row: any) => row.playlist_id);
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

        // Create a new playlist
        const newPlaylist = new Playlist();
        newPlaylist.name = `Generated Playlist based on Song ${songId}`;
        newPlaylist.user = user; // Assuming Playlist entity has a 'user' relationship
        await this.playlistRepository.save(newPlaylist);

        // Add related tracks to the new playlist
        for (const track of relatedTracks) {
            const playlistSong = new PlaylistSong();
            playlistSong.playlist = newPlaylist;
            playlistSong.track = await this.dataSource.manager.findOne(Track, { where: { id: track.id } });
            await this.dataSource.manager.save(playlistSong);
        }

        return newPlaylist;
    }

    async addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void> {
        const playlist = await this.playlistRepository.findOneBy({ id: playlistId });
        const tracks = await this.trackRepository.findBy({ id: In(trackIds) });
    
        for (const track of tracks) {
            // Assuming PlaylistSong entity and repository exist
            const playlistSong = new PlaylistSong();
            playlistSong.playlist = playlist; // Set the playlist
            playlistSong.track = track; // Set the track
            await this.dataSource.manager.save(playlistSong); // Save each association
        }
    }
    
}

export default new PlaylistService();
