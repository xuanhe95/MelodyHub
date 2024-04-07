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
    async searchTracks(
      title?: string,
      artist?: string,
      album?: string,
      start?: string,
      end?: string,
      tempo?: number,
      danceability?: number,
      energy?: number,
      duration?: number
  ): Promise<Track[] | null> {
      try {
          let sql = `SELECT * FROM tracks WHERE 1=1`;
          let params: (string | number | Date)[] = [];
  
          if (title) {
              sql += ` AND title LIKE ?`;
              params.push(`%${title}%`); // Using LIKE for partial match
          }
          if (artist) {
              sql += ` AND artist LIKE ?`;
              params.push(`%${artist}%`); // Using LIKE for partial match
          }
          if (album) {
              sql += ` AND album LIKE ?`;
              params.push(`%${album}%`); // Using LIKE for partial match
          }
          if (start) {
              const startDate = new Date(start);
              sql += ` AND release_date >= ?`;
              params.push(startDate);
          }
          if (end) {
              const endDate = new Date(end);
              sql += ` AND release_date <= ?`;
              params.push(endDate);
          }
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
    
    // since SONGS db is old, return all songs that are on daily_rank if founded
    async getAllTimeTopTracksByCountry(country: string): Promise<Track[] | null> {
      try {
        const sql = `            
            SELECT s.*
            FROM SONGS s
            JOIN (
                SELECT spotify_id
                FROM TOP_SONGS_BY_COUNTRY
                WHERE country = ?
                GROUP BY spotify_id
                ORDER BY SUM(daily_rank) ASC
            ) top_songs ON s.id = top_songs.spotify_id;   
            `;

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        const tracks = await queryRunner.query(sql, [country]);
        await queryRunner.release();
        return tracks;
      } catch (error) {
        console.error("Error fetching top tracks by country:", error);
        return null;
      }
  }

  // Get Top N Tracks from Playlists
  async getTopNTracksFromPlaylists(n: number): Promise<Track[] | null> {
    try {
      const sql = `
        SELECT s.*, COUNT(ps.song_id) as appearances
        FROM SONGS s
        JOIN PLAYLIST_SONGS ps ON s.id = ps.song_id
        GROUP BY s.id
        ORDER BY appearances DESC
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

  // Searching songs based on keywords
  async findTracksByKeywords(keywords: string[]): Promise<Track[]> {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();

      const query = keywords.map(keyword => `name LIKE '%${keyword}%'`).join(' OR ');
      const tracks = await queryRunner.query(`SELECT * FROM tracks WHERE ${query}`);

      await queryRunner.release();
      return tracks;
  }

  //get an overview of the average features (optional: tempo, energy) of songs for a selected genre.  
  async getAverageFeaturesByGenre(genre: string): Promise<any> {
    try {
        const sql = `
            SELECT G.genre, AVG(S.tempo) AS AverageTempo, AVG(S.energy) AS AverageEnergy
            FROM ARTIST_GENRES G
            JOIN ARTISTS A ON G.artist_id = A.artist_id
            JOIN RELEASE_BY R ON A.artist_id = R.artist_id
            JOIN SONGS S ON R.song_id = S.id
            WHERE G.genre = ?
            GROUP BY G.genre;
        `;

        // Execute the query with the provided genre
        const results = await AppDataSource.query(sql, [genre]);
        return results;
    } catch (error) {
        console.error("Error getting average features by genre:", error);
        return [];
    }
  }
}

export default TrackService;
