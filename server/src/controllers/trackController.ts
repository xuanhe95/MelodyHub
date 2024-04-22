import { Request, Response } from 'express';
import TrackService from '../services/trackService';

export class TrackController {
    private trackService: TrackService;

    constructor(trackService: TrackService) {
        this.trackService = trackService;
        this.searchTracks = this.searchTracks.bind(this);
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

            const { page, limit, title, artist, album, start, end, tempo_low, 
                tempo_high, danceability_low, danceability_high,
                energy_low, energy_high, duration_low, duration_high} = req.query;

            console.log(page, limit, title, danceability_high
                , energy_low, energy_high, duration_low, duration_high);
            
            // Call service method
            const response = await this.trackService.searchTracks(
                page? parseInt(page as string, 10): 1,
                limit? parseInt(limit as string, 10):24,
                title as string,
                artist as string,
                album as string,
                start as string, // Convert to Date in service if needed
                end as string, // Convert to Date in service if needed
                parseFloat(tempo_low as string), // Convert to number in service if needed
                parseFloat(tempo_high as string), // Convert to number in service if needed
                parseFloat(danceability_low as string), // Convert to number in service if needed
                parseFloat(danceability_high as string), // Convert to number in service if needed
                parseFloat(energy_low as string), // Convert to number in service if needed
                parseFloat(energy_high as string), // Convert to number in service if needed
                parseFloat(duration_low as string), // Convert to number in service if needed
                parseFloat(duration_high as string) // Convert to number in service if needed
            );

            // Return response
            res.json(response);
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
