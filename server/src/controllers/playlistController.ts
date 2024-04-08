import { Request, Response } from "express";
import { PlaylistService } from '../services/playlistService';
import { User } from "../entity/user";

export class PlaylistController {
    private playlistService: PlaylistService;

    constructor(playlistService: PlaylistService) {
        this.playlistService = playlistService;
        this.listAllPlaylists = this.listAllPlaylists.bind(this);
        this.createPlaylistForUser = this.createPlaylistForUser.bind(this);
        this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);
        this.listAllPlaylists = this.listAllPlaylists.bind(this);
        this.findPlaylistsByUser = this.findPlaylistsByUser.bind(this);

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
        console.log("Creating playlist for user");
        console.log(req.body);
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


    async addTrackToPlaylist(req: Request, res: Response): Promise<void> {

        const { playlistId, trackId } = req.body;
        const user = res.locals.user as User;

        try{
            const playlist = await this.playlistService.findPlaylistById(playlistId);

            if(!playlist){
                res.status(404).json({ message: "Playlist not found" });
                return;
            }
            else if(playlist.user.id !== user.id){
                // User does not have permission to add tracks to this playlist
                res.status(403).json({ message: "You do not have permission to add tracks to this playlist" });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error1", error });
            return;
        }

        try {
            // Add track to playlist
            await this.playlistService.addTrackToPlaylist(playlistId, trackId);
            res.json({ message: "Track added to playlist successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }

    }
}
