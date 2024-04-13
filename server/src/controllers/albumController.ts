import { Request, Response } from "express";
import AlbumService from '../services/albumService';
//import { MusicBrainzAPI } from "../utils/musicBrainz";
//import { Album } from "../entity/album";
//import { AlbumWithCover } from "../entity/albumWithCover";
import { getAlbumCover } from '../external/musicBrainz';

class AlbumController {
    private albumService: AlbumService;

    constructor(albumService: AlbumService) {
        this.albumService = albumService;
        //this.getAllAlbumsWithPages = this.getAllAlbumsWithPages.bind(this);
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

// Get all albums with pagination
/*
async getAllAlbumsWithPages(req: Request, res: Response): Promise<void> {
    console.log('req.query:', req.query);
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 12;
    try {
        let albums = await this.albumService.getAllAlbumsWithPages(page, limit);

        // 确保 albums 不为空
        if (albums && albums.length > 0) {
            albums = albums as AlbumWithCover[];
            console.log('albums:', albums);

            // 使用 Promise.all 处理所有专辑封面的获取
            await Promise.all(albums?.map(async (album: AlbumWithCover) => {
                try {
                    // 检查 tracks 属性是否存在且是一个数组
                    if (album.tracks && Array.isArray(album.tracks) && album.tracks.length > 0) {
                        // 获取专辑封面
                        const cover = await MusicBrainzAPI.getCover(album.name, album.tracks[0].title, 250);
                        if (cover) {
                            await fetch(cover).then(response => {
                            // 检查响应的状态码是否为 200
                            if(response.status === 200) {
                                album.cover = cover;
                            } else {
                                album.cover = "https://via.placeholder.com/250";
                            }
                         }) .catch(error => {
                            // 处理加载图片失败的情况
                            console.error("Error loading image:", error);
                            album.cover = "https://via.placeholder.com/250";
                        }); 
                        } else {
                            album.cover = "https://via.placeholder.com/500";
                        }
                    } else {
                        console.error(`No tracks found for album ${album.name}`);
                    }
                } catch (error) {
                    console.error("Error fetching album cover:", error);
                    // 处理获取专辑封面出错的情况
                }
            }));
            
        }

        

        // 响应客户端
        res.json(albums);
    } catch (error) {
        console.error("Error fetching albums with pagination:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}*/
    
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
            const album = await this.albumService.findAlbumById(albumId);
            if (album) {
                const albumCover = await getAlbumCover(album.name);
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
