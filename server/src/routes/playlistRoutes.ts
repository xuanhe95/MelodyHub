import { Router } from 'express';
import { PlaylistService } from "../services/playlistService";
import { PlaylistController } from '../controllers/playlistController';
import { AppDataSource } from '../db';
import { UserService } from '../services/userService';
import AuthController from '../controllers/authController';
import AuthService from '../services/authService';


const router = Router();
const playlistService = new PlaylistService(AppDataSource, new UserService());
const playlistController = new PlaylistController(playlistService);

const authService = new AuthService();
const userService = new UserService();
const authController = new AuthController(userService, authService);



router.get('/playlists', (req, res) => playlistController.listAllPlaylists(req, res));
router.get('/playlists/user/:userId', (req, res) => playlistController.findPlaylistsByUser(req, res));
router.post('/playlists/generate', (req, res) => playlistController.generatePlaylistBasedOnTrack(req, res));
router.put('/playlists/:playlistId/tracks', (req, res) => playlistController.addTracksToPlaylist(req, res));


// Create playlist for user
router.post('/playlists', authController.authUser, playlistController.createPlaylistForUser);
// Add track to playlist
router.post('/playlists/track', authController.authUser, playlistController.addTrackToPlaylist);


export default router;
