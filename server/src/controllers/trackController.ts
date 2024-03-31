import { Request, Response } from 'express'; // 假设使用 Express 框架
import TrackService from '../services/trackService';
import { Track } from '../models/track';

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

    // 联合搜索
    async searchTracks(req: Request, res: Response): Promise<void> {
        try {
            const { title, artist, album, start, end, tempo, danceability, energy, duration} = req.query;
            console.log('title:', title);
            console.log('artist:', artist);
            console.log('album:', album);
            console.log('start:', start);
            console.log('end:', end);

            
            // 将日期字符串转换为日期对象
            let startDate = typeof start === 'string' ? new Date(start) : undefined;
            let endDate = typeof end === 'string' ? new Date(end) : undefined;

            // 调用服务的搜索方法
            let tracks: Track[] | null = await this.trackService.searchTracks(
                title as string,
                artist as string,
                album as string,
                startDate,
                endDate
            );

            // 如果没有找到任何结果，则返回 404
            if (!tracks) {
                res.status(404).json({ message: 'No tracks found' });
                return;
            }

            // 如果找到了结果，则返回结果
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