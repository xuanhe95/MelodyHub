import { DataSource, Repository } from 'typeorm';
import { Artist } from '../entity/artist';
import { Track } from '../entity/track';
import { ArtistGenre } from '../entity/artistGenre';
import { Album } from '../entity/album';

class ArtistService {
    private artistRepository: Repository<Artist>;
    private trackRepository: Repository<Track>;

    constructor(private dataSource: DataSource) {
        this.artistRepository = this.dataSource.getRepository(Artist);
        this.trackRepository = this.dataSource.getRepository(Track);
    }

    // Find an artist by name
    async findArtistByName(name: string): Promise<Artist | null> {
        return this.artistRepository.findOne({
            where: { name },
        });
    }

    // List all artists
    async listAllArtists(): Promise<Artist[]> {
        return this.artistRepository.find();
    }

    // Get details for a specific artist by ID
    async getArtistDetails(id: string): Promise<Artist | null> {
        return this.artistRepository.findOne({
            where: { id },
            relations: ['releaseBys', 'releaseBys.track', 'genres', 'playlistSongs'],
        });
    }
    
    

    async findAllSongsByArtist(artistName: string): Promise<Track[]> {
        const artist = await this.artistRepository.findOne({
            where: { name: artistName },
            relations: ['releaseBys', 'releaseBys.track'],
        });

        if (!artist) {
            throw new Error(`Artist ${artistName} not found`);
        }

        return artist.releaseBys.map(releaseBy => releaseBy.track); 
    }

    async getAllGenresForArtist(artistName: string): Promise<string[]> {
        const artist = await this.artistRepository.findOne({
            where: { name: artistName },
            relations: ['artistGenres'], // Assuming 'artistGenres' is the relation in Artist entity
        });

        if (!artist) {
            throw new Error(`Artist ${artistName} not found`);
        }

        return artist.genres.map(artistGenre => artistGenre.genre); // Assuming 'genre' is the property in ArtistGenre entity
    }

    async getAverageTempoForArtist(artistName: string): Promise<number> {
        const result = await this.dataSource.query(`
            SELECT AVG(S.tempo) AS averageTempo
            FROM SONGS S
            JOIN RELEASE_BY R ON S.id = R.song_id
            WHERE R.artist_id = (
                SELECT artist_id
                FROM ARTISTS
                WHERE artist = ?
            )
        `, [artistName]);
        return result[0].averageTempo;
    }

    async findSongsWithMultipleArtists(): Promise<any[]> {
        return this.dataSource.query(`
            SELECT S.name, COUNT(R.artist_id) AS artist_count
            FROM SONGS S
            JOIN RELEASE_BY R ON S.id = R.song_id
            GROUP BY S.id
            HAVING COUNT(R.artist_id) > 1
        `);
    }

    async findCollaborativeTracks(artistName: string): Promise<Artist[]> {
        return this.dataSource.query(`
            SELECT DISTINCT A2.artist AS Collaborator
            FROM ARTISTS A1
            JOIN RELEASE_BY R1 ON A1.artist_id = R1.artist_id
            JOIN RELEASE_BY R2 ON R1.song_id = R2.song_id
            JOIN ARTISTS A2 ON R2.artist_id = A2.artist_id
            WHERE A1.artist = ? AND A2.artist <> ?
        `, [artistName, artistName]);
    }

    async analyzeTrendOfMostInfluencingGenresInPastTenYears(): Promise<any> {
        const sql = `
            WITH GenreMetrics AS (
                SELECT
                    G.genre,
                    AVG(S.energy) AS AverageEnergy,
                    AVG(S.danceability) AS AverageDanceability,
                    COUNT(DISTINCT R.artist_id) AS ArtistCount
                FROM ARTIST_GENRES G
                JOIN ARTISTS A ON G.artist_id = A.artist_id
                JOIN RELEASE_BY R ON A.artist_id = R.artist_id
                JOIN SONGS S ON R.song_id = S.id
                WHERE S.release_date BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL 10 YEAR) AND CURRENT_DATE
                GROUP BY G.genre
                HAVING ArtistCount > 5
            ),
            RankedGenres AS (
                SELECT
                    genre,
                    AverageEnergy,
                    AverageDanceability,
                    ArtistCount,
                    (AverageEnergy + AverageDanceability) * ArtistCount AS InfluenceScore,
                    RANK() OVER (ORDER BY (AverageEnergy + AverageDanceability) * ArtistCount DESC) AS InfluenceRank
                FROM GenreMetrics
            )
            SELECT genre, AverageEnergy, AverageDanceability, ArtistCount, InfluenceScore
            FROM RankedGenres
            WHERE InfluenceRank <= 10;
        `;

        return this.dataSource.query(sql);
    }

    async findRisingStarsAmongArtists(): Promise<any> {

        const sql = `
        WITH ArtistMetrics AS (
            SELECT
              R.artist_id,
              S.release_year AS Year,
              AVG(S.danceability) AS AvgDanceability,
              COUNT(DISTINCT S.id) AS SongCount
            FROM SONGS S
            JOIN RELEASE_BY R ON R.song_id = S.id
            WHERE S.release_year > 2015
            GROUP BY R.artist_id, S.release_year
          ),
          FilteredMetrics AS (
            SELECT
              artist_id,
              MIN(Year) AS FirstYear,
              MAX(Year) AS LastYear
            FROM ArtistMetrics
            WHERE SongCount > 20
            GROUP BY artist_id
          ),
          RisingStars AS (
          SELECT
              FM.artist_id,
              (AM2.AvgDanceability - AM1.AvgDanceability) AS ImprovementScore
              FROM FilteredMetrics FM
              JOIN ArtistMetrics AM1 ON FM.artist_id = AM1.artist_id AND FM.FirstYear = AM1.Year
              JOIN ArtistMetrics AM2 ON FM.artist_id = AM2.artist_id AND FM.LastYear = AM2.Year
              ORDER BY ImprovementScore DESC
              LIMIT 10
          )
          SELECT
            A.artist,
            RS.ImprovementScore
          FROM RisingStars RS
          JOIN ARTISTS A ON RS.artist_id = A.artist_id;
        `;

        return this.dataSource.query(sql);
    }

    async findArtistBySongId(songId: string): Promise<Artist[]> {
        const artists = await this.dataSource.query(`
            SELECT A.*
            FROM ARTISTS A
            JOIN RELEASE_BY R ON A.artist_id = R.artist_id
            WHERE R.song_id = ?
        `, [songId]);

        return artists;
    }

    async findArtistsByAlbumId(albumId: string): Promise<Artist[]> {
        try {
            const albumRepository = this.dataSource.getRepository(Album);
            const album = await albumRepository.findOne({
                where: { id: albumId },
                relations: ["tracks"]
            });
    
            if (!album || !album.tracks.length) {
                // If no album or no tracks found, return an empty array
                return [];
            }
    
            // Fetch the artists for each track
            const artistPromises = album.tracks.map(track =>
                this.findArtistBySongId(track.id)
            );
            const artistArrays = await Promise.all(artistPromises);
            
            // Flatten the array of arrays and deduplicate the artists based on artist_id
            const allArtists = artistArrays.flat();
            const uniqueArtists = Array.from(new Map(allArtists.map(artist => [artist.id, artist])).values());
    
            return uniqueArtists;
        } catch (error) {
            console.error('Error fetching artists for album:', error);
            return [];
        }
    }
}

export default ArtistService;
