import { AppDataSource } from "../db";
import { Album } from "../entity/album";
import { Track } from "../entity/track";

class AlbumService {



    
    async findTracksByAlbumId(albumId: string): Promise<Track[] | null> {
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

    async listAllAlbums(): Promise<Album[] | null> {
        try {
            const albumRepository = AppDataSource.getRepository(Album);
            return await albumRepository.find();
        } catch (error) {
            console.error('Error fetching all albums:', error);
            return null;
        }
    }

    async findAlbumById(id: string): Promise<Album | null> {
        try {
            const albumRepository = AppDataSource.getRepository(Album);
            return await albumRepository.findOneBy({ id });
        } catch (error) {
            console.error('Error fetching album by ID:', error);
            return null;
        }
    }

    async getAllAlbumsWithPages(page: number, limit: number): Promise<Album[] | null> {
        try {
            console.log('page:', page, 'limit:', limit);
            const albumRepository = AppDataSource.getRepository(Album);
            return await albumRepository.find({
                // select: {
                //     // 这里假设你想要获取Album的某些字段，例如id和name
                //     id: true,
                //     name: true,
                //     // tracks: {
                //     //     title: true
                //     // }
                // },
                // relations: ["tracks"],
                skip: (page - 1) * limit,
                take: limit
            });
        } catch (error) {
            console.error('Error fetching all albums with pagination:', error);
        }
        return null;
    }

    async getTotalAlbumsCount(): Promise<number> {
        try {
            const albumRepository = AppDataSource.getRepository(Album);
            return await albumRepository.count();
        } catch (error) {
            console.error('Error fetching total albums count:', error);
            return 0;
        }
    }

    async fetchRandomNAlbums(numOfAlums: number): Promise<Album[] | null> {
        try {
            const albumRepository = AppDataSource.getRepository(Album);
            return await albumRepository.query(`
                SELECT * FROM ALBUMS
                ORDER BY RAND()
                LIMIT ?;
            `, [numOfAlums]);
        } catch (error) {
            console.error('Error fetching random albums:', error);
            return null;
        }
    }
}

export default AlbumService;
