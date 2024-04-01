import { Request, Response } from 'express'; // 假设使用 Express 框架
import TrackService from '../services/trackService';
import { Track } from '../entity/track';

class TrackController {
    private trackService: TrackService;

    constructor(trackService: TrackService) {
        this.trackService = trackService;
    }

    // 通过id获取歌曲信息
    async getTrackById(req: Request, res: Response): Promise<void> {
        try {
            const trackId: string = req.params.id; // 假设 ID 存在于请求的参数中，这里假设参数名为 id
            const track = await this.trackService.getTrackById(trackId);
            if (track) {
                res.json(track);
            } else {
                res.status(404).json({ message: "Track not found" });
            }
        } catch (error) {
            console.error("Error occurred while fetching track:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async searchTracks(req: Request, res: Response): Promise<void> {
        try {
            const title = req.query.title as string | undefined;
            const artist = req.query.artist as string | undefined;
            const album = req.query.album as string | undefined;
            let startDate: Date | undefined = undefined;
            let endDate: Date | undefined = undefined;
    
            if (typeof req.query.start === 'string') {
                startDate = new Date(req.query.start);
            }
    
            if (typeof req.query.end === 'string') {
                endDate = new Date(req.query.end);
            }
    
            const tempo = req.query.tempo as number | undefined;
            const danceability = req.query.danceability as number | undefined;
            const energy = req.query.energy as number | undefined;
            const duration = req.query.duration as number | undefined;
    
            const tracks: Track[] | null = await this.trackService.searchTracks(
                title,
                artist,
                album,
                startDate,
                endDate,
                tempo,
                danceability,
                energy,
                duration
            );
    
            if (!tracks) {
                res.status(404).json({ message: 'No tracks found' });
                return;
            }
    
            res.json(tracks);
        } catch (error) {
            console.error('Error occurred while searching tracks:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    

    // 获取所有歌曲
    async getAllTracks(req: Request, res: Response): Promise<void> {
        try {
            const tracks = await this.trackService.getAllTracks();
            res.json(tracks);
        } catch (error) {
            console.error("Error occurred while fetching tracks:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // 获取各国Top N歌曲
    async getTopTracksByCountry(req: Request, res: Response): Promise<void> {
        try {
            const country: string = req.params.country; // 假设 country 存在于请求的参数中，这里假设参数名为 country
            console.log("country:", country);
            const tracks = await this.trackService.getTopTracksByCountry(country, 10);
            res.json(tracks);
        } catch (error) {
            console.error("Error occurred while fetching top tracks:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // 获取歌曲列表中的Top N歌曲
    async getTopTracksByPlaylists(req: Request, res: Response): Promise<void> {
        try {
            const tracks = await this.trackService.getTopTracksByPlaylists(10);
            res.json(tracks);
        } catch (error) {
            console.error("Error occurred while fetching top tracks:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    
}

export default TrackController;