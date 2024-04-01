import { Router } from 'express';
import TrackService from "../services/trackService";
import TrackController from '../controllers/trackController';

const router = Router();
const trackService = new TrackService();
const trackController = new TrackController(trackService);

// Track routes
router.get('/tracks/search', (req, res) => trackController.searchTracks(req, res));
router.get('/tracks/top/country/:country', (req, res) => trackController.getTopTracksByCountry(req, res));
router.get('/tracks/top/playlists', (req, res) => trackController.getTopTracksByPlaylists(req, res));
router.get('/tracks/:id', (req, res) => trackController.getTrackById(req, res));
router.get('/tracks', (req, res) => trackController.getAllTracks(req, res));

export default router;
