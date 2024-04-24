import { Router } from 'express';
import { PokemonService } from "../services/pokemonService";
import PokemonController from '../controllers/pokemonController';

const router = Router();
const pokemonService = new PokemonService();
const pokemonController = new PokemonController(pokemonService);

// Route to associate a playlist with a Pokemon based on the playlist's attributes
router.get('/pokemon/:playlistId', (req, res) => pokemonController.associatePlaylistWithPokemon(req, res));

export default router;
