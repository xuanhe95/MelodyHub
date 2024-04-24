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


    //     // Complex search query, retaining direct SQL usage
    //     async searchTracks(
    //       page: number,
    //       limit: number,
    //     title?: string,
    //     artist?: string,
    //     album?: string,
    //     year_low?: string,
    //     year_high?: string,
    //     tempo_low?: number,
    //     tempo_high?: number,
    //     danceability_low?: number,
    //     danceability_high?: number,
    //     energy_low?: number,
    //     energy_high?: number,
    //     duration_low?: number,
    //     duration_high?: number,
    //     last_id?: string
    // ): Promise<any | null> {
    //     try {
    //       let whereSongs = '';
    //       let paramsSongs = [];
          
    //       // Filters for SONGS table
    //       if (title) {
    //           whereSongs += ` AND name LIKE ?`;
    //           paramsSongs.push(`${title}%`);
    //       }
    //       if (artist) {
    //           whereSongs += ` AND artist LIKE ?`;
    //           paramsSongs.push(`${artist}%`);
    //       }
    //       if (year_low) {
    //           const startDate = new Date(year_low);
    //           whereSongs += ` AND release_date >= ?`;
    //           paramsSongs.push(startDate);
    //       }
    //       if (year_high) {
    //           const endDate = new Date(year_high);
    //           whereSongs += ` AND release_date <= ?`;
    //           paramsSongs.push(endDate);
    //       }
    //       if (tempo_low !== undefined && tempo_high !== undefined
    //             && (tempo_low > 0 || tempo_high < 250)) {
    //           whereSongs += ` AND tempo BETWEEN ? AND ?`;
    //           paramsSongs.push(tempo_low);
    //           paramsSongs.push(tempo_high);
    //       }
    //       if (danceability_low !== undefined && danceability_high !== undefined
    //             && (danceability_low > 0 || danceability_high < 1)
    //       ) {
    //           whereSongs += ` AND danceability BETWEEN ? AND ?`;
    //           paramsSongs.push(danceability_low);
    //           paramsSongs.push(danceability_high);
    //       }
    //       if (energy_low !== undefined && energy_high !== undefined
    //             && (energy_low > 0 || energy_high < 1)
    //       ) {
    //           whereSongs += ` AND energy BETWEEN ? AND ?`;
    //           paramsSongs.push(energy_low);
    //           paramsSongs.push(energy_high);
    //       }
    //       if (duration_low !== undefined && duration_high !== undefined
    //             && (duration_low > 0 || duration_high < 1)
    //       ) {
    //           whereSongs += ` AND duration BETWEEN ? AND ?`;
    //           paramsSongs.push(duration_low);
    //           paramsSongs.push(duration_high);
    //       }

          
    //       let whereAlbums = '';
    //       let paramsAlbums = [];
          
    //       // Filters for ALBUMS table
    //       if (album) {
    //           whereAlbums += ` AND album LIKE ?`;
    //           paramsAlbums.push(`${album}%`);
    //       }
          
    //       // Complete SQL
    //       let sql = `SELECT filtered_songs.id, filtered_songs.name, a.album 
    //                  FROM (
    //                      SELECT * FROM SONGS
    //                      WHERE 1=1 ${whereSongs}
    //                  ) AS filtered_songs
    //                  JOIN ALBUMS a ON filtered_songs.album_id = a.album_id
    //                  WHERE 1=1 ${whereAlbums}`;
          
    //       let totalSql = `SELECT COUNT(*) as total
    //                       FROM (
    //                           SELECT * FROM SONGS
    //                           WHERE 1=1 ${whereSongs}
    //                       ) AS filtered_songs
    //                       JOIN ALBUMS a ON filtered_songs.album_id = a.album_id
    //                       WHERE 1=1 ${whereAlbums}`;
          


    //       console.log('sql:', sql);
    //       console.log('totalSql:', totalSql);
    //       const repo = AppDataSource.getRepository(Track);
    //       const total = await repo.query(totalSql, [...paramsSongs, ...paramsAlbums]);
          
    //       const offset = (page - 1) * limit;
    //       sql += ` LIMIT ? OFFSET ?`;
    //       paramsSongs.push(limit, offset);
          

    //       console.log(sql);

    //       const tracks = await repo.query(sql, [...paramsSongs, ...paramsAlbums]);
    //       console.log(sql, [...paramsSongs, ...paramsAlbums]);
    //       console.log('total:', total);

          
    //       let result = {
    //             tracks,
    //             total: Math.ceil(total[0].total / limit)
    //       };
    //       return result;
          
    //     } catch (error) {
    //         console.error("Error searching tracks:", error);
    //         return null;
    //     }
    //   }
      

  //   // Complex search query, retaining direct SQL usage
  //   async searchTracks(
  //       page: number,
  //       limit: number,
  //     title?: string,
  //     artist?: string,
  //     album?: string,
  //     year_low?: string,
  //     year_high?: string,
  //     tempo_low?: number,
  //     tempo_high?: number,
  //     danceability_low?: number,
  //     danceability_high?: number,
  //     energy_low?: number,
  //     energy_high?: number,
  //     duration_low?: number,
  //     duration_high?: number
  // ): Promise<any | null> {
  //     try {
  
  //         let sql = `SELECT id, name, a.album FROM ALBUMS a JOIN SONGS s ON s.album_id = a.album_id WHERE 1=1`;
  //         let totalSql = `SELECT COUNT(*) as total FROM SONGS s JOIN ALBUMS a ON s.album_id = a.album_id WHERE 1=1`;
  //         let where = '';
  //         let params: (string | number | Date)[] = [];


        
  //         console.log('title:', title);
  //         if (title) {
  //             where += ` AND name LIKE ?`;
  //             params.push(`${title}%`); // Using LIKE for partial match
  //         }
  //         if (artist) {
  //             where += ` AND artist LIKE ?`;
  //             params.push(`${artist}%`); // Using LIKE for partial match
  //         }
  //         if (album) {
  //             where += ` AND a.album LIKE ?`;
  //             params.push(`${album}%`); // Using LIKE for partial match
  //         }
  //         if (year_low) {
  //             const startDate = new Date(year_low);
  //             where += ` AND release_date >= ?`;
  //             params.push(startDate);
  //         }
  //         if (year_high) {
  //             const endDate = new Date(year_high);
  //             where += ` AND release_date <= ?`;
  //             params.push(endDate);
  //         }
  //         if (tempo_low !== undefined && tempo_high !== undefined
  //               && (tempo_low > 0 || tempo_high < 250)) {
  //             where += ` AND tempo BETWEEN ? AND ?`;
  //             params.push(tempo_low);
  //             params.push(tempo_high);

  //         }
  //         if (danceability_low !== undefined && danceability_high !== undefined
  //               && (danceability_low > 0 || danceability_high < 1)
  //         ) {
  //             where += ` AND danceability BETWEEN ? AND ?`;
  //             params.push(danceability_low);
  //             params.push(danceability_high);
  //         }
  //         if (energy_low !== undefined && energy_high !== undefined
  //               && (energy_low > 0 || energy_high < 1)
  //         ) {
  //             where += ` AND energy BETWEEN ? AND ?`;
  //             params.push(energy_low);
  //             params.push(energy_high);
  //         }
  //         if (duration_low !== undefined && duration_high !== undefined
  //               && (duration_low > 0 || duration_high < 1)
  //         ) {
  //             where += ` AND duration BETWEEN ? AND ?`;
  //             params.push(duration_low);
  //             params.push(duration_high);
  //         }

  //         console.log('where:', where); 
  //       // Pagination

  //       const repo = AppDataSource.getRepository(Track);

  //         const total = await repo.query(totalSql+where, params);


  //         const offset = (page - 1) * limit;

  //           where += ` LIMIT ? OFFSET ?`;
  //           params.push(limit, offset);

  //           const tracks = await repo.query(sql+where, params);
  //         console.log(sql+where, params);
  //        // await queryRunner.release();
  //         let result = {
  //               tracks,
  //               total: Math.ceil(total[0].total / limit)
  //           }
  //           return result;
  //     } catch (error) {
  //         console.error("Error searching tracks:", error);
  //         return null;
  //     }
  //   }
    
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
