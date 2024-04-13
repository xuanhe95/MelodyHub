import { Router } from 'express';
import AlbumService from "../services/albumService";
import AlbumController from '../controllers/albumController';

const router = Router();
const albumService = new AlbumService();
const albumController = new AlbumController(albumService);

// // Get all tracks for a specific album by its ID
// router.get('/albums/:id/tracks', (req, res) => albumController.findTracksByAlbumId(req, res));

// // Get a specific album by its ID
// router.get('/albums/:id', (req, res) => albumController.findAlbumById(req, res));

// Get all albums
router.get('/albums', (req, res) => albumController.listAllAlbums(req, res));

// Get all albums with pagination
router.get('/albums/pages', albumController.getAllAlbumsWithPages);

export default router;
