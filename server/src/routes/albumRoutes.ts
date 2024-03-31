import { Router } from 'express';
import AlbumService from "../services/albumService";
import AlbumController from '../controllers/albumController';
import { db } from '../db';

const router = Router();
const albumService = new AlbumService(db);
const albumController = new AlbumController(albumService);

// Album routes
router.get('/album/:id', (req, res) => albumController.getTracks(req, res));

export default router;
