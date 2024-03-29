import { Request, Response } from "express";
import AlbumService from '../Service/albumService';


class AlbumController {
    private albumService: AlbumService;

    constructor(albumService: AlbumService) {
        this.albumService = albumService;
    }

    // 通过id获取专辑信息
    async getAlbumById(req: Request, res: Response): Promise<void> {
        try {
            const albumId: string = req.params.id; // 假设 ID 存在于请求的参数中，这里假设参数名为 id
            const id = parseInt(albumId, 10);
            const album = await this.albumService.getAlbumById(id);
            if (album) {
                res.json(album);
            } else {
                res.status(404).json({ message: "Album not found" });
            }
        } catch (error) {
            console.error("Error occurred while fetching album:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // 获取所有专辑
    async getAllAlbums(req: Request, res: Response): Promise<void> {
        try {
            const albums = await this.albumService.getAllAlbums();
            res.json(albums);
        } catch (error) {
            console.error("Error occurred while fetching albums:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}

export default AlbumController;