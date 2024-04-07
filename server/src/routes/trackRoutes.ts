import { Router } from 'express';
import TrackService from '../services/trackService';
import { TrackController } from '../controllers/trackController';

const router = Router();
const trackService = new TrackService(); // Pass the necessary data source or repository to the service
const trackController = new TrackController(trackService);

router.get('/tracks', (req, res) => trackController.getAllTracks(req, res));
router.get('/tracks/:id', (req, res) => trackController.getTrackById(req, res));
router.get('/tracks/title', (req, res) => trackController.getTracksByTitle(req, res));
router.get('/tracks/search', (req, res) => trackController.searchTracks(req, res));
router.get('/tracks/top/:country', (req, res) => trackController.getAllTimeTopTracksByCountry(req, res));
router.get('/tracks/playlists/top/:n', (req, res) => trackController.getTopNTracksFromPlaylists(req, res));
router.get('/tracks/keywords', (req, res) => trackController.findTracksByKeywords(req, res));
router.get('/tracks/genre/:genre/average-features', (req, res) => trackController.getAverageFeaturesByGenre(req, res));

export default router;
