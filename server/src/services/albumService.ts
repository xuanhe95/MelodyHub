import { Pool, QueryResult } from "pg";
import {Album} from "../models/album";
import {Track} from "../models/track";
class AlbumService {
    private pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }

    async getTracks(id: string): Promise<Album | null> {
        try {
            const sql = `
            SELECT *
            FROM tracks t
            JOIN tracks_albums_mapping tam ON t.id = tam.track_id
            JOIN albums a ON tam.album_id = a.id
            WHERE a.id = $1`;


            const result: QueryResult = await this.pool.query(sql, [id]);
            let tracks: Track[] = [];

            for (let i = 0; i < result.rows.length; i++) {
                const track = result.rows[i];
                const trackObj: Track = {
                    id: track.id,
                    title: track.title,
                    tempo: track.tempo,
                    danceability: track.danceability,
                    release_date: track.release_date,
                    energy: track.energy,
                    duration: track.duration,
                };
                tracks.push(trackObj);
            }

            let album: Album = {
                id: id,
                title: result.rows[0].album_title,
                tracks: tracks,
            };
            return album;
        } catch (err) {
            console.error(err);
            return null;
        }
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