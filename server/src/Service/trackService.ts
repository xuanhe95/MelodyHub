import { Pool, QueryResult } from "pg";
import { Request, Response } from "express";
import {Track} from "../Model/track";

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
    async getTrackById(id: string): Promise<Track | null> {
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

    // 搜索，通过歌曲名获取歌曲信息
    async getTracksByTitle(title: string): Promise<Track[] | null> {
        try {
            const result: QueryResult = await this.pool.query(
                "SELECT * FROM tracks WHERE title = $1",
                [title]
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

    // 搜索，通过歌手名获取歌曲信息
    async getTracksByArtist(artist: string): Promise<Track[] | null> {
        try {
            const sql = `SELECT * FROM tracks
            WHERE artist = $1`

            const result: QueryResult = await this.pool.query(
                sql,
                [artist]
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

    // 搜索，通过专辑名获取歌曲信息
    
    async searchTracks(title?: string, artist?: string, album?: string, start?: Date, end?: Date, tempo?:number, danceability?:number, energy?:number, duration?: number): Promise<Track[] | null> {
        try {
            let sql = `SELECT * FROM tracks WHERE`;
            let params = [];
            let index = 1;
            
            if (title) {
                sql += ` title = $${index} AND`;
                params.push(title);
                index++;
            }
            if (artist) {
                sql += ` artist = $${index} AND`;
                params.push(artist);
                index++;
            }
            if (album) {
                sql += ` album = $${index} AND`;
                params.push(album);
                index++;
            }
            if (start && end) {
                sql += ` release_date BETWEEN $${index} AND $${index + 1}`;
                params.push(start, end);
            }
            if (tempo) {
                sql += ` tempo = $${index}`;
                params.push(tempo);
            }
            if (danceability) {
                sql += ` danceability = $${index}`;
                params.push(danceability);
            }
            if (energy) {
                sql += ` energy = $${index}`;
                params.push(energy);
            }
            if (duration) {
                sql += ` duration = $${index}`;
                params.push(duration);
            }
            
            // 如果没有任何条件，则移除 WHERE 关键字
            if (params.length === 0) {
                sql = sql.replace('WHERE', '');
            } else if(sql.endsWith('AND')) {
                sql = sql.slice(0, -3);
            }

            const result: QueryResult = await this.pool.query(
                sql,
                params
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

    // 各国Top N歌曲
    async getTopTracksByCountry(country:string, n: number): Promise<Track[] | null> {
        try {
            console.log('n:', n);
            const sql = `WITH top_10 AS (SELECT tt.country,
                       tt.track_id,
                       ROW_NUMBER() OVER (PARTITION BY tt.country ORDER BY COUNT(tt.track_id) DESC) AS row_num
                FROM top_tracks tt
                GROUP BY tt.country,
                         tt.track_id
                )

                SELECT * from top_10
                JOIN tracks t ON top_10.track_id = t.id
                WHERE country = $1
                LIMIT $2;`;

            const result: QueryResult = await this.pool.query(sql, [country, n]);
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

    // 歌曲列表中的Top N歌曲
    async getTopTracksByPlaylists(n: number): Promise<Track[] | null> {
        try {
            const sql = `WITH top_tracks AS (
                SELECT tracks.id, COUNT(tracks.id) AS num_tracks
                FROM tracks
                JOIN playlist_tracks_mapping ptm ON tracks.id = ptm.track_id
                GROUP BY tracks.id
                ORDER BY COUNT(tracks.id) DESC
                LIMIT $1
            )
            SELECT tracks.*
            FROM tracks
            JOIN top_tracks ON top_tracks.id = tracks.id;
            `;

            const result: QueryResult = await this.pool.query(sql, [n]);
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