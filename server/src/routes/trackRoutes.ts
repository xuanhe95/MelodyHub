import { Router } from 'express';
import TrackService from "../services/trackService";
import TrackController from '../controllers/trackController';
import { db } from '../db';

const router = Router();
const trackService = new TrackService(db);
const trackController = new TrackController(trackService);

// Track routes
router.get('/track/search/', (req, res) => trackController.searchTracks(req, res));
router.get('/track/top/country/:country', (req, res) => trackController.getTopTracksByCountry(req, res));
router.get('/track/top/playlists', (req, res) => trackController.getTopTracksByPlaylists(req, res));

export default router;
