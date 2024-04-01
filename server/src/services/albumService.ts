import { AppDataSource } from "../db";
import { Album } from "../entity/album";
import { Track } from "../entity/track";

class AlbumService {
    
    async getTracks(albumId: string): Promise<Track[] | null> {
        try {
            const albumRepository = AppDataSource.getRepository(Album);
            const album = await albumRepository.findOne({
                where: { id: albumId },
                relations: ["tracks"]
            });
            return album ? album.tracks : null;
        } catch (error) {
            console.error('Error fetching tracks for album:', error);
            return null;
        }
    }

    async getAllAlbums(): Promise<Album[] | null> {
        try {
            const albumRepository = AppDataSource.getRepository(Album);
            return await albumRepository.find();
        } catch (error) {
            console.error('Error fetching all albums:', error);
            return null;
        }
    }

    async getAlbumById(id: string): Promise<Album | null> {
        try {
            const albumRepository = AppDataSource.getRepository(Album);
            return await albumRepository.findOneBy({ id });
        } catch (error) {
            console.error('Error fetching album by ID:', error);
            return null;
        }
    }
}

export default AlbumService;
