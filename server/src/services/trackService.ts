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

    // Complex search query with direct SQL usage using cursor-based pagination
async searchTracks(
  limit: number,
  title?: string,
  artist?: string,
  album?: string,
  year_low?: string,
  year_high?: string,
  tempo_low?: number,
  tempo_high?: number,
  danceability_low?: number,
  danceability_high?: number,
  energy_low?: number,
  energy_high?: number,
  duration_low?: number,
  duration_high?: number,
  last_id?: string
): Promise<{ tracks: Track[] } | null> {
  try {
      let whereSongs = '';
      let params: (string | number | Date)[] = [];
      duration_low = 0;
      duration_high = 1;

      // Filters for SONGS table
      if (title) {
          whereSongs += ` AND s.name LIKE ?`;
          params.push(`${title}%`);
      }
      if (artist) {
          whereSongs += ` AND s.artist LIKE ?`;
          params.push(`${artist}%`);
      }
      if (year_low) {
          const startDate = new Date(year_low);
          whereSongs += ` AND s.release_date >= ?`;
          params.push(startDate);
      }
      if (year_high) {
          const endDate = new Date(year_high);
          whereSongs += ` AND s.release_date <= ?`;
          params.push(endDate);
      }
      if (tempo_low !== undefined && tempo_high !== undefined && (tempo_low > 0 || tempo_high < 250) ){
          whereSongs += ` AND s.tempo BETWEEN ? AND ?`;
          params.push(tempo_low, tempo_high);
      }
      if (danceability_low !== undefined && danceability_high !== undefined && (danceability_low > 0 || danceability_high < 1)) {
          whereSongs += ` AND s.danceability BETWEEN ? AND ?`;
          params.push(danceability_low, danceability_high);
      }
      if (energy_low !== undefined && energy_high !== undefined && (energy_low > 0 || energy_high < 1)){
          whereSongs += ` AND s.energy BETWEEN ? AND ?`;
          params.push(energy_low, energy_high);
      }
      if (duration_low !== undefined && duration_high !== undefined && (duration_low > 0 || duration_high < 1)) {
          whereSongs += ` AND s.duration BETWEEN ? AND ?`;
          params.push(duration_low, duration_high);
      }
      if (album) {
          whereSongs += ` AND a.album LIKE ?`;
          params.push(`${album}%`);
      }
      if (last_id) {
          whereSongs += ` AND s.id > ?`;
          params.push(last_id);
      }

      // Complete SQL
      let sql = `SELECT s.id, s.name, a.album, a.album_id
                 FROM SONGS s
                 JOIN ALBUMS a ON s.album_id = a.album_id
                 WHERE 1=1 ${whereSongs}
                 ORDER BY s.id ASC
                 LIMIT ?`;
      params.push(limit);

      // Assuming you have a repository or similar to run the query
      const repo = AppDataSource.getRepository(Track);
      const tracks = await repo.query(sql, params);

      console.log('Executed SQL:', sql, params);
      return { tracks };
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
