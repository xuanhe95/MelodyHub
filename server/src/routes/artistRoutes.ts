import { Router } from 'express';
import { AppDataSource } from "../db"; 
import ArtistService from "../services/artistService";
import ArtistController from '../controllers/artistController';

const router = Router();
const artistService = new ArtistService(AppDataSource);
const artistController = new ArtistController(artistService);
// Get details of an artist by name
router.get('/artists/name/:name', (req, res) => artistController.findArtistByName(req, res));

// List all artists
router.get('/artists', (req, res) => artistController.listAllArtists(req, res));

// Get details of a specific artist by ID
router.get('/artists/:id', (req, res) => artistController.getArtistDetails(req, res));

// Find all songs by a specific artist
router.get('/artists/:name/songs', (req, res) => artistController.findAllSongsByArtist(req, res));

// Get all genres for a specific artist
router.get('/artists/:name/genres', (req, res) => artistController.getAllGenresForArtist(req, res));

// Get the average tempo for a specific artist
router.get('/artists/:name/average-tempo', (req, res) => artistController.getAverageTempoForArtist(req, res));

// Find artist(s) by song ID
router.get('/artists/bytrack/:id', (req, res) => artistController.findArtistBySongId(req, res));

// Find artist(s) by album ID
router.get('/artists/byalbum/:id', (req, res) => artistController.findArtistsByAlbumId(req, res));


export default router;
