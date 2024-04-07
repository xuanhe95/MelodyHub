import { Router } from 'express';
import { PlaylistService } from "../services/playlistService";
import { PlaylistController } from '../controllers/playlistController';
import { AppDataSource } from '../db';
import { UserService } from '../services/userService';

const router = Router();
const playlistService = new PlaylistService(AppDataSource, new UserService());
const playlistController = new PlaylistController(playlistService);

router.get('/playlists', (req, res) => playlistController.listAllPlaylists(req, res));
router.get('/playlists/user/:userId', (req, res) => playlistController.findPlaylistsByUser(req, res));
router.post('/playlists/generate', (req, res) => playlistController.generatePlaylistBasedOnTrack(req, res));
router.post('/playlists', (req, res) => playlistController.createPlaylistForUser(req, res));
router.put('/playlists/:playlistId/tracks', (req, res) => playlistController.addTracksToPlaylist(req, res));

export default router;
