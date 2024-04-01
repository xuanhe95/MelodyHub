import { AppDataSource } from "../db";
import { Track } from "../entity/track";

class TrackService {
    // Getting all tracks using TypeORM
    async getAllTracks(): Promise<Track[] | null> {
      try {
          const trackRepository = AppDataSource.getRepository(Track);
          return await trackRepository.find();
      } catch (error) {
          console.error("Error fetching all tracks:", error);
          return null;
      }
    }

    // Getting a track by ID using TypeORM
    async getTrackById(id: string): Promise<Track | null> {
      try {
          const trackRepository = AppDataSource.getRepository(Track);
          return await trackRepository.findOneBy({ id });
      } catch (error) {
          console.error("Error fetching track by ID:", error);
          return null;
      }
    }

    // Getting a track by Title using TypeORM
    async getTracksByTitle(title: string): Promise<Track[] | null> {
      try {
          const trackRepository = AppDataSource.getRepository(Track);
          return await trackRepository.findBy({ title });
      } catch (error) {
          console.error("Error fetching tracks by title:", error);
          return null;
      }
    }

    // Complex search query, retaining direct SQL usage
    async searchTracks(title?: string, artist?: string, album?: string, start?: Date, end?: Date, tempo?: number, danceability?: number, energy?: number, duration?: number): Promise<Track[] | null> {
      try {
          let sql = `SELECT * FROM tracks WHERE 1=1`;
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

          const queryRunner = AppDataSource.createQueryRunner();
          await queryRunner.connect();
          const tracks = await queryRunner.query(sql, params);
          await queryRunner.release();
          return tracks;
      } catch (error) {
          console.error("Error searching tracks:", error);
          return null;
      }
    }
    async getTopTracksByCountry(country: string, n: number): Promise<Track[] | null> {
      try {
        // Note: The actual SQL will depend on your database schema and how you're tracking top tracks by country
        const sql = `
            SELECT tracks.* FROM tracks
            JOIN top_tracks_country ON tracks.id = top_tracks_country.track_id
            WHERE top_tracks_country.country = ?
            ORDER BY top_tracks_country.rank LIMIT ?`;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const tracks = await queryRunner.query(sql, [country, n]);
        await queryRunner.release();
        return tracks;
      } catch (error) {
        console.error("Error fetching top tracks by country:", error);
        return null;
      }
  }

  // Get Top N Tracks from Playlists using direct SQL
  async getTopTracksByPlaylists(n: number): Promise<Track[] | null> {
    try {
      // Note: This SQL assumes there's a way to determine "top" tracks in playlists, e.g., via a count of appearances
      const sql = `
          SELECT tracks.*, COUNT(playlist_tracks.track_id) AS appearance_count
          FROM tracks
          JOIN playlist_tracks ON tracks.id = playlist_tracks.track_id
          GROUP BY tracks.id
          ORDER BY appearance_count DESC
          LIMIT ?`;

      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      const tracks = await queryRunner.query(sql, [n]);
      await queryRunner.release();
      return tracks;
    } catch (error) {
      console.error("Error fetching top tracks by playlists:", error);
      return null;
    }
  }
}

export default TrackService;
