import { Pool } from "mysql";
import {Album} from "../models/album";
import {Track} from "../models/track";
class AlbumService {
    private db: Pool;
    constructor(db: Pool) {
        this.db = db;
    }

    async getTracks(id: string): Promise<Album | null> {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT *, a.title as album_title
                FROM tracks t
                JOIN tracks_albums_mapping tam ON t.id = tam.track_id
                JOIN albums a ON tam.album_id = a.id
                WHERE a.id = ?`;
            this.db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Error fetching tracks:', err);
                reject(null);
                return;
            }

            if (results.length === 0) {
                resolve(null);
                return;
            }

            const tracks: Track[] = results.map((track: any): Track => ({
                id: track.id,
                title: track.title,
                tempo: track.tempo,
                danceability: track.danceability,
                release_date: track.release_date,
                energy: track.energy,
                duration: track.duration,
            }));

            let album: Album = {
                id: id,
                title: results[0].album_title,
                tracks: tracks,
            };
            resolve(album);
            });
        });
    }

    // 获取所有专辑
    async getAllAlbums(): Promise<Album[] | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM albums";
            
            this.db.query(sql, (err, results) => {
              if (err) {
                console.error('Error fetching albums:', err);
                reject(null); // Or handle the error appropriately for your context
                return;
              }
      
              const albums = results.map((album: any) => ({
                id: album.id,
                title: album.title,
              }));
      
              resolve(albums);
            });
          });
    }

    // 通过id获取专辑信息
    async getAlbumById(id: number): Promise<Album | null> {
        return new Promise((resolve, reject) => {
            // Use MySQL's ? for parameter placeholders
            const sql = "SELECT * FROM albums WHERE id = ?";
      
            this.db.query(sql, [id], (err, results) => {
              if (err) {
                console.error('Error fetching album:', err);
                reject(null); // Or handle the error according to your application's needs
                return;
              }
      
              if (results.length === 0) {
                resolve(null);
              } else {
                // Assuming the first result is the album we're interested in
                const album = results[0];
                const albumObj: Album = {
                  id: album.id,
                  title: album.title,
                };
                resolve(albumObj);
              }
            });
        })
    }
}

export default AlbumService;