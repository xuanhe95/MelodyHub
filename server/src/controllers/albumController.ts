import { Request, Response } from "express";
import AlbumService from '../services/albumService';
import { Album } from "../entity/album";
import { AlbumWithCover } from "../entity/albumWithCover";
import { AlbumCoverAPI } from "../external/albumCoverAPI";
class AlbumController {
    private albumService: AlbumService;

    constructor(albumService: AlbumService) {
        this.albumService = albumService;
        this.getAllAlbumsWithPages = this.getAllAlbumsWithPages.bind(this);
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


async getAllAlbumsWithPages(req: Request, res: Response): Promise<void> {
    console.log('req.query:', req.query);
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 18;
    try {
        const albums = await this.albumService.getAllAlbumsWithPages(page, limit);
        const count = await this.albumService.getTotalAlbumsCount();

        res.json({
            albums: albums,
            count: count,
            limit: limit,
            page: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error("Error fetching albums with pagination:", error);
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

    async fetchAlbumImage(req: Request, res: Response): Promise<void> {
        const albumId: string = req.params.id;
        try {
            // find album_name by album_name because the API needs album_name
            const album = await this.albumService.findAlbumById(albumId);
            if (album) {
                const albumCover = await AlbumCoverAPI.getAlbumCover(album.name);
                res.json({"imageUrl" : albumCover});
            } else {
                res.json({"imageUrl" : ''});
            }
        } catch (error) {
            console.error("Error fetching album:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default AlbumController;
