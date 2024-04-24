import { Request, Response } from "express";
import { PokemonService } from '../services/pokemonService';

class PokemonController {
    private pokemonService: PokemonService;

    constructor(pokemonService: PokemonService) {
        this.pokemonService = pokemonService;
    }

    async associatePlaylistWithPokemon(req: Request, res: Response): Promise<void> {
        const { playlistId } = req.params; // Assuming playlistId is passed as a URL parameter

        try {
            const pokemon = await this.pokemonService.associatePlaylistWithPokemon(playlistId);
            res.json(pokemon);
        } catch (error) {
            console.error("Error associating playlist with Pokemon:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default PokemonController;
