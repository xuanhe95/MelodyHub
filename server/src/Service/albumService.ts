import { Pool, QueryResult } from "pg";
import {Album} from "../Model/album";
class AlbumService {
    private pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }

    // 获取所有专辑
    async getAllAlbums(): Promise<Album[] | null> {
        try {
            const sql = "SELECT * FROM albums";
            const result: QueryResult = await this.pool.query(sql);
            let albums: Album[] = [];

            for (let i = 0; i < result.rows.length; i++) {
                const album = result.rows[i];
                const albumObj: Album = {
                    id: album.id,
                    title: album.title,
                    cover_art: album.cover_art,
                    created_at: album.created_at,
                    updated_at: album.updated_at,
                    deleted_at: album.deleted_at,
                };
                albums.push(albumObj);
            }
            return albums;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    // 通过id获取专辑信息
    async getAlbumById(id: number): Promise<Album | null> {
        try {
            const result: QueryResult = await this.pool.query(
                "SELECT * FROM albums WHERE id = $1",
                [id]
            );
            if (result.rows.length === 0) {
                return null;
            } else {
                const album = result.rows[0];
                const albumObj: Album = {
                    id: album.id,
                    title: album.title,
                    cover_art: album.cover_art,
                    created_at: album.created_at,
                    updated_at: album.updated_at,
                    deleted_at: album.deleted_at,
                };
                return albumObj;
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    }



    
}

export default AlbumService;