import { Request, Response } from 'express';
import ConcertService from '../services/concertService';

class ConcertController {
    private concertService: ConcertService;

    constructor(concertService: ConcertService) {
        this.concertService = concertService;
    }

    async getArtistSetlists(req: Request, res: Response): Promise<void> {
        try {
            const mbid = req.params.mbid; // Extract the Musicbrainz ID from the request parameters
            const page = parseInt(req.query.p as string) || 1; // Extract the page number from query params or default to 1
            const concerts = await this.concertService.fetchArtistSetlists(mbid, page);
            res.json(concerts);
        } catch (error) {
            console.error("Error occurred while getting artist setlists:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default ConcertController;