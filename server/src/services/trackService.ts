import { Pool } from "mysql";
import { Request, Response } from "express";
import {Track} from "../models/track";

class TrackService {
    private db: Pool;
    constructor(db: Pool) {
        this.db = db;
    }

    // 获取所有歌曲
    async getAllTracks(): Promise<Track[] | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM tracks";
            this.db.query(sql, (err, results) => {
              if (err) {
                console.error(err);
                reject(null); // or resolve(null) if you prefer not to throw in case of an error
                return;
              }
      
              // Assuming `results` is automatically parsed into objects by mysql
              const tracks: Track[] = results.map((track: any): Track => ({
                id: track.id,
                title: track.title,
              }));
      
              resolve(tracks);
            });
          })

    }



    // 通过id获取歌曲信息
    async getTrackById(id: string): Promise<Track | null> {
        return new Promise((resolve, reject) => {
            // Note the placeholder change from $1 to ?, which is MySQL's syntax
            const sql = "SELECT * FROM tracks WHERE id = ?";
            
            this.db.query(sql, [id], (err, results) => {
              if (err) {
                console.error(err);
                reject(null); // or resolve(null) depending on your error handling strategy
                return;
              }
      
              if (results.length === 0) {
                resolve(null);
              } else {
                const track = results[0];
                const trackObj: Track = {
                  id: track.id,
                  title: track.title,
                };
                resolve(trackObj);
              }
            });
        });
    }

    // 搜索，通过歌曲名获取歌曲信息
    async getTracksByTitle(title: string): Promise<Track[] | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM tracks WHERE title = ?";
            
            this.db.query(sql, [title], (err, results) => {
              if (err) {
                console.error('Error fetching tracks:', err);
                reject(null); // Handle the rejection appropriately
                return;
              }
      
              if (results.length === 0) {
                resolve(null);
              } else {
                const tracks: Track[] = results.map((track: any): Track => ({
                  id: track.id,
                  title: track.title,
                }));
                resolve(tracks);
              }
            });
        });
    }

    // 搜索，通过歌手名获取歌曲信息
    async getTracksByArtist(artist: string): Promise<Track[] | null> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tracks WHERE artist = ?`;
      
            this.db.query(sql, [artist], (err, results) => {
              if (err) {
                console.error('Error fetching tracks:', err);
                reject(null); // Or handle the error according to your needs
                return;
              }
      
              if (results.length === 0) {
                resolve(null);
              } else {
                const tracks: Track[] = results.map((track: any): Track => ({
                  id: track.id,
                  title: track.title,
                }));
      
                resolve(tracks);
              }
            });
        });
    }

    // 搜索，通过专辑名获取歌曲信息
    
    async searchTracks(title?: string, artist?: string, album?: string, start?: Date, end?: Date, tempo?:number, danceability?:number, energy?:number, duration?: number): Promise<Track[] | null> {
        let sql = `SELECT * FROM tracks WHERE 1=1`; // Use 1=1 for easy appending of conditions
        let params: (string | number | Date)[] = [];
  
        if (title) {
          sql += ` AND title = ?`;
          params.push(title);
        }
        if (artist) {
          sql += ` AND artist = ?`;
          params.push(artist);
        }
        if (album) {
          sql += ` AND album = ?`;
          params.push(album);
        }
        if (start && end) {
          sql += ` AND release_date BETWEEN ? AND ?`;
          params.push(start, end);
        }
        // Repeat for other conditions like tempo, danceability, etc.
        if (tempo) {
          sql += ` AND tempo = ?`;
          params.push(tempo);
        }
        if (danceability) {
          sql += ` AND danceability = ?`;
          params.push(danceability);
        }
        if (energy) {
          sql += ` AND energy = ?`;
          params.push(energy);
        }
        if (duration) {
          sql += ` AND duration = ?`;
          params.push(duration);
        }
  
        return new Promise((resolve, reject) => {
          this.db.query(sql, params, (err, results) => {
            if (err) {
              console.error('Error searching tracks:', err);
              reject(null);
              return;
            }
  
            if (results.length === 0) {
              resolve(null);
            } else {
              const tracks: Track[] = results.map((track: any): Track => ({
                id: track.id,
                title: track.title,
                // Map other properties as needed
              }));
              resolve(tracks);
            }
          });
        });
    }

    // 各国Top N歌曲
    async getTopTracksByCountry(country:string, n: number): Promise<Track[] | null> {
        return new Promise((resolve, reject) => {
            // MySQL version of the query. Note: MySQL uses `?` for parameters.
            const sql = `
              WITH top_tracks AS (
                SELECT tt.country,
                  tt.track_id,
                  ROW_NUMBER() OVER (PARTITION BY tt.country ORDER BY COUNT(tt.track_id) DESC) AS row_num
                FROM top_tracks tt
                GROUP BY tt.country, tt.track_id
              )
              SELECT t.* FROM top_tracks
              JOIN tracks t ON top_tracks.track_id = t.id
              WHERE top_tracks.country = ?
              LIMIT ?;`;
      
            this.db.query(sql, [country, n], (err, results) => {
              if (err) {
                console.error('Error fetching top tracks by country:', err);
                reject(null);
                return;
              }
      
              if (results.length === 0) {
                resolve(null);
              } else {
                const tracks = results.map((track: any): Track => ({
                  id: track.id,
                  title: track.title,
                  // Map additional track properties as needed
                }));
                resolve(tracks);
              }
            });
        });
    }

    // 歌曲列表中的Top N歌曲
    async getTopTracksByPlaylists(n: number): Promise<Track[] | null> {
        return new Promise((resolve, reject) => {
            // Updated SQL for MySQL. Note the change from $1 to ? for the parameter.
            const sql = `
              WITH top_tracks AS (
                SELECT tracks.id, COUNT(tracks.id) AS num_tracks
                FROM tracks
                JOIN playlist_tracks_mapping ptm ON tracks.id = ptm.track_id
                GROUP BY tracks.id
                ORDER BY COUNT(tracks.id) DESC
                LIMIT ?
              )
              SELECT tracks.*
              FROM tracks
              JOIN top_tracks ON top_tracks.id = tracks.id;
            `;
      
            this.db.query(sql, [n], (err, results) => {
              if (err) {
                console.error('Error fetching top tracks by playlists:', err);
                reject(null);
                return;
              }
      
              if (results.length === 0) {
                resolve(null);
              } else {
                const tracks: Track[] = results.map((track: any): Track => ({
                  id: track.id,
                  title: track.title,
                  // Map other properties as necessary
                }));
                resolve(tracks);
              }
            });
        });
    }
}

export default TrackService;