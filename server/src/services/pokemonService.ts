import { DataSource } from 'typeorm';
import { PlaylistService } from './playlistService';
import { UserService } from './userService';
import { AppDataSource } from "../db";
/**
    Average Tempo: Could be related to a Pokémon's Speed stat. Faster tempos might correlate with Pokémon that have higher Speed.
    Average Danceability: Might be associated with a Pokémon's Attack stat. A Pokémon with high Attack could be seen as one that "hits the beat" hard.
    Average Energy: Could relate to a Pokémon's Special Attack stat, where higher energy in a song aligns with a Pokémon having powerful special moves.
 */

export class PokemonService {
    // Assuming you have a method to get Pokemon data, such as getPokemonByStats
    async associatePlaylistWithPokemon(playlistId: string): Promise<any> {
        // Create instances of the dependencies
        const dataSource = AppDataSource; // assuming AppDataSource is already initialized somewhere
        const userService = new UserService();

        const playlistService = new PlaylistService(dataSource, userService);
        const attributes = await playlistService.getAverageAttributesOfTracksInPlaylist(playlistId);
        

        // Find a Pokemon with stats close to the attributes
        const pokemon = this.getPokemonByStats(attributes);
        return pokemon;
    }

    async getPokemonByStats(attributes: any): Promise<any> {
        const { averageTempo, averageDanceability, averageEnergy } = attributes;
    
        // Calculate the range for stats with a +/- 20% tolerance
        const minSpeed = averageTempo * 0.8;
        const maxSpeed = averageTempo * 1.2;
        const minAttack = averageDanceability * 0.8 *100;
        const maxAttack = averageDanceability * 1.2 *100;
        const minHP = averageEnergy * 0.8*100;
        const maxHP = averageEnergy * 1.2*100;
    
        try {
          // Query to find the matching pokemon or a random one if none match
            const query = `
                SELECT pokemon_number, pokemon_name FROM POKEMONS
                WHERE (hp BETWEEN ? AND ?)
                AND (attack BETWEEN ? AND ?)
                AND (speed BETWEEN ? AND ?)
                ORDER BY RAND() LIMIT 1;
            `;

            const pokemon = await AppDataSource.query(query, [
                minHP,
                maxHP,
                minAttack,
                maxAttack,
                minSpeed,
                maxSpeed,
            ]);
            let pokemonData;
            if (pokemon.length === 0) {
                const randomPokemonQuery = `
                    SELECT pokemon_number, pokemon_name FROM POKEMONS
                    ORDER BY RAND() LIMIT 1;
                `;
                pokemonData = await AppDataSource.query(randomPokemonQuery);
            }
            if (pokemon.length > 0) {
                pokemonData = pokemon[0];
            }    
            // Format the Pokémon image URL
            const formattedNumber = pokemonData.pokemon_number.toString().padStart(3, '0');
            const formattedName = pokemonData.pokemon_name.replace(/ /g, '');
            //https://archives.bulbagarden.net/media/upload/3/37/0479Rotom.png
            //https://bulbapedia.bulbagarden.net/wiki/File:0479Rotom.png

            const imageUrl = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${formattedNumber}.png`;
            //const imageUrl = `https://bulbapedia.bulbagarden.net/wiki/File:${formattedNumber}${formattedName}.png`;
            //https://bulbapedia.bulbagarden.net/wiki/File:0068Machamp.png
            // Return the Pokémon data along with the image URL
            return {
                ...pokemonData,
                image_url: imageUrl
            };
        } catch (error) {
            console.error('Error in getPokemonByStats:', error);
            throw new Error('Unable to retrieve Pokémon data.');
        }
    }
}

