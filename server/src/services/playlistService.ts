import { AppDataSource } from '../db';
import { PlaylistSong } from '../entity/playlistSong';

class PlaylistService {
    async getAllPlaylistIds(): Promise<string[]> {
        const entityManager = AppDataSource.manager;
        const query = 'SELECT DISTINCT playlist_id FROM playlist_songs';
        const result = await entityManager.query(query);
        return result.map((row: any) => row.playlist_id);
    }
}

export default new PlaylistService();
