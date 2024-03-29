import { Request, Response } from 'express'; // 假设使用 Express 框架
import TrackService from '../Service/trackService';

class TrackController {
    private trackService: TrackService;

    constructor(trackService: TrackService) {
        this.trackService = trackService;
    }

    // 通过id获取歌曲信息
    async getTrackById(req: Request, res: Response): Promise<void> {
        try {
            const trackId: string = req.params.id; // 假设 ID 存在于请求的参数中，这里假设参数名为 id
            const id = parseInt(trackId, 10);
            const track = await this.trackService.getTrackById(id);
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

    // 通过专辑id获取歌曲信息
    async getTrackByAlbumId(req: Request, res: Response): Promise<void> {
        try {
            const albumId: string = req.params.id; // 假设 ID 存在于请求的参数中，这里假设参数名为 id
            const id = parseInt(albumId, 10);
            const tracks = await this.trackService.getTrackByAlbumId(id);
            if (tracks) {
                res.json(tracks);
            } else {
                res.status(404).json({ message: "Tracks not found" });
            }
        } catch (error) {
            console.error("Error occurred while fetching tracks:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    
}