import { Pool, QueryResult } from "pg";
import { Request, Response } from "express";
import {Track} from "../Model/Track";

class TrackService {
    private pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }

    // 获取所有歌曲
    async getAllTracks(): Promise<Track[] | null> {
        try {

            const sql =  "SELECT * FROM tracks";
            const result: QueryResult = await this.pool.query(sql);
            let tracks: Track[] = [];

            for (let i = 0; i < result.rows.length; i++) {
                const track = result.rows[i];
                const trackObj: Track = {
                    id: track.id,
                    title: track.title,
                };
                tracks.push(trackObj);
            }
            return tracks;
        } catch (err) {
            console.error(err);
            return null;
        }

    }

    // 通过id获取歌曲信息
    async getTrackById(id: number): Promise<Track | null> {
        try {
            const result: QueryResult = await this.pool.query(
                "SELECT * FROM tracks WHERE id = $1",
                [id]
            );
            if (result.rows.length === 0) {
                return null;
            } else {
                const track = result.rows[0];
                const trackObj: Track = {
                    id: track.id,
                    title: track.title,
                };
                return trackObj;
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    // 通过专辑id获取歌曲信息
    async getTrackByAlbumId(id: number): Promise<Track[] | null> {
        try {
            const result: QueryResult = await this.pool.query(
                "SELECT * FROM tracks WHERE album_id = $1",
                [id]
            );
            if (result.rows.length === 0) {
                return null;
            } else {
                let tracks: Track[] = [];
                for (let i = 0; i < result.rows.length; i++) {
                    const track = result.rows[i];
                    const trackObj: Track = {
                        id: track.id,
                        title: track.title,
                    };
                    tracks.push(trackObj);
                }
                return tracks;
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    }


}

export default TrackService;