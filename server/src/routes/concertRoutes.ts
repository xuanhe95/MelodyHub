import { Router } from 'express';
import ConcertService from "../services/concertService";
import ConcertController from '../controllers/concertController';

const router = Router();
const concertService = new ConcertService();
const concertController = new ConcertController(concertService);

router.get('/artists/:mbid/setlists', (req, res) => concertController.getArtistSetlists(req, res));

export default router;
