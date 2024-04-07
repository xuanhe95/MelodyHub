import { Request, Response } from "express";
import { PlaylistService } from '../services/playlistService';
import { User } from "../entity/user";

export class PlaylistController {
    private playlistService: PlaylistService;

    constructor(playlistService: PlaylistService) {
        this.playlistService = playlistService;
    }

    async listAllPlaylists(req: Request, res: Response): Promise<void> {
        try {
            const playlists = await this.playlistService.listAllPlaylists();
            res.json(playlists);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async findPlaylistsByUser(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.userId);
        try {
            const playlists = await this.playlistService.findPlaylistsByUser(userId);
            res.json(playlists);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async generatePlaylistBasedOnTrack(req: Request, res: Response): Promise<void> {
        const { songId, userId } = req.body;
        try {
            const playlist = await this.playlistService.generatePlaylistBasedOnTrackByAdminPlaylists(songId, userId);
            res.json(playlist);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async createPlaylistForUser(req: Request, res: Response): Promise<void> {
        const { playlistName, userId } = req.body;
        try {
            const newPlaylist = await this.playlistService.createPlaylistForUser(playlistName, userId);
            res.json(newPlaylist);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    async addTracksToPlaylist(req: Request, res: Response): Promise<void> {
        const { playlistId, trackIds } = req.body;
        try {
            await this.playlistService.addTracksToPlaylist(playlistId, trackIds);
            res.json({ message: "Tracks added to playlist successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}
