import { Request, Response } from 'express';
import TrackService from '../services/trackService';

export class TrackController {
    private trackService: TrackService;

    constructor(trackService: TrackService) {
        this.trackService = trackService;
    }

    async getAllTracks(req: Request, res: Response): Promise<void> {
        try {
            const tracks = await this.trackService.getAllTracks();
            res.json(tracks);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async getTrackById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const track = await this.trackService.getTrackById(id);
            if (track) {
                res.json(track);
            } else {
                res.status(404).json({ message: "Track not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async getTracksByTitle(req: Request, res: Response): Promise<void> {
        try {
            const title = req.query.title as string;
            const tracks = await this.trackService.getTracksByTitle(title);
            if (tracks && tracks.length > 0) {
                res.json(tracks);
            } else {
                res.status(404).json({ message: "No tracks found with the given title" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async searchTracks(req: Request, res: Response): Promise<void> {
        try {
            // Extract query params
            const { title, artist, album, start, end, tempo, danceability, energy, duration } = req.query;

            // Call service method
            const tracks = await this.trackService.searchTracks(
                title as string,
                artist as string,
                album as string,
                start as string, // Convert to Date in service if needed
                end as string, // Convert to Date in service if needed
                parseFloat(tempo as string),
                parseFloat(danceability as string),
                parseFloat(energy as string),
                parseFloat(duration as string),
            );

            res.json(tracks);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async getAllTimeTopTracksByCountry(req: Request, res: Response): Promise<void> {
        try {
            const country = req.params.country;
            const tracks = await this.trackService.getAllTimeTopTracksByCountry(country);
            res.json(tracks);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async getTopNTracksFromPlaylists(req: Request, res: Response): Promise<void> {
        try {
            const n = parseInt(req.params.n, 10);
            const tracks = await this.trackService.getTopNTracksFromPlaylists(n);
            res.json(tracks);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async findTracksByKeywords(req: Request, res: Response): Promise<void> {
        try {
            const keywords = (req.query.keywords as string).split(",");
            const tracks = await this.trackService.findTracksByKeywords(keywords);
            res.json(tracks);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async getAverageFeaturesByGenre(req: Request, res: Response): Promise<void> {
        try {
            const genre = req.params.genre;
            const features = await this.trackService.getAverageFeaturesByGenre(genre);
            res.json(features);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}
