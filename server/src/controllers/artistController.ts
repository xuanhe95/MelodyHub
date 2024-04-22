import { Request, Response } from 'express';
import ArtistService from '../services/artistService';

class ArtistController {
    private artistService: ArtistService;

    constructor(artistService: ArtistService) {
        this.artistService = artistService;
    }

    async findArtistByName(req: Request, res: Response): Promise<void> {
        const artistName = req.params.name;
        try {
            const artist = await this.artistService.findArtistByName(artistName);
            if (artist) {
                res.json(artist);
            } else {
                res.status(404).json({ message: `Artist ${artistName} not found` });
            }
        } catch (error) {
            console.error("Error fetching artist by name:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async listAllArtists(req: Request, res: Response): Promise<void> {
        try {
            const artists = await this.artistService.listAllArtists();
            res.json(artists);
        } catch (error) {
            console.error("Error fetching all artists:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getArtistDetails(req: Request, res: Response): Promise<void> {
        const artistId = req.params.id;
        try {
            const artist = await this.artistService.getArtistDetails(artistId);
            if (artist) {
                // Transforming the response to include tracks directly
                const transformedArtist = {
                    ...artist,
                    tracks: artist.releaseBys.map(releaseBy => releaseBy.track)
                };
                res.json(transformedArtist);
            } else {
                res.status(404).json({ message: "Artist not found" });
            }
        } catch (error) {
            console.error("Error fetching artist details:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    

    async findAllSongsByArtist(req: Request, res: Response): Promise<void> {
        const artistName = req.params.name;
        try {
            const songs = await this.artistService.findAllSongsByArtist(artistName);
            res.json(songs);
        } catch (error) {
            console.error("Error fetching songs by artist:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getAllGenresForArtist(req: Request, res: Response): Promise<void> {
        const artistName = req.params.name;
        try {
            const genres = await this.artistService.getAllGenresForArtist(artistName);
            res.json(genres);
        } catch (error) {
            console.error("Error fetching genres for artist:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
    // Add other methods here as needed, e.g., getAverageTempoForArtist, findSongsWithMultipleArtists, etc.

    // Example for adding a method to get the average tempo for an artist:
    async getAverageTempoForArtist(req: Request, res: Response): Promise<void> {
        const artistName = req.params.name;
        try {
            const averageTempo = await this.artistService.getAverageTempoForArtist(artistName);
            res.json({ averageTempo });
        } catch (error) {
            console.error("Error fetching average tempo for artist:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async findArtistBySongId(req: Request, res: Response): Promise<void> {
        const songId = req.params.id;
        try {
            const artists = await this.artistService.findArtistBySongId(songId);
            if (artists.length) {
                res.json(artists);
            } else {
                res.status(404).json({ message: `No artists found for song ID ${songId}` });
            }
        } catch (error) {
            console.error("Error fetching artists by song ID:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async findArtistsByAlbumId(req: Request, res: Response): Promise<void> {
        const albumId = req.params.id;
        try {
            const artists = await this.artistService.findArtistsByAlbumId(albumId);
            res.json(artists);
        } catch (error) {
            console.error("Error fetching artists by album ID:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default ArtistController;
