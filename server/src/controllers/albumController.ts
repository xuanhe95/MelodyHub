import { Request, Response } from "express";
import AlbumService from '../services/albumService';

class AlbumController {
    private albumService: AlbumService;

    constructor(albumService: AlbumService) {
        this.albumService = albumService;
    }

    // Get all tracks in an album
    async findTracksByAlbumId(req: Request, res: Response): Promise<void> {
        const albumId: string = req.params.id;
        try {
            const tracks = await this.albumService.findTracksByAlbumId(albumId);
            if (tracks) {
                res.json(tracks);
            } else {
                res.status(404).json({ message: "Album not found or has no tracks" });
            }
        } catch (error) {
            console.error("Error fetching album tracks:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Get all albums
    async listAllAlbums(req: Request, res: Response): Promise<void> {
        try {
            const albums = await this.albumService.listAllAlbums();
            res.json(albums);
        } catch (error) {
            console.error("Error fetching albums:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
    // Get album information by ID
    async findAlbumById(req: Request, res: Response): Promise<void> {
        const albumId: string = req.params.id;
        try {
            const album = await this.albumService.findAlbumById(albumId);
            if (album) {
                res.json(album);
            } else {
                res.status(404).json({ message: "Album not found" });
            }
        } catch (error) {
            console.error("Error fetching album:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async fetchRandomNAlbums(req: Request, res: Response): Promise<void> {
        try {
            const numOfAlums: number = +req.params.numOfAlbums
            const albums = await this.albumService.fetchRandomNAlbums(numOfAlums);
            res.json(albums);
        } catch (error) {
            console.error("Error fetching albums:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}

export default AlbumController;
