import axios from 'axios';
import { Concert } from '../entity/concert';

class ConcertService {
    // Function to fetch setlists for an artist by their Musicbrainz ID (mbid)
    async fetchArtistSetlists(mbid: string, page: number = 1): Promise<Concert[]> {
        try {
            const response = await axios.get(`https://api.setlist.fm/1.0/artist/${mbid}/setlists`, {
                params: { p: page },
                headers: { Accept: 'application/json' }
            });

            // Process the response data and map to the Concert entity
            const concerts: Concert[] = response.data.setlist.map((setlistItem: any) => {
                // Create a new Concert entity for each setlist
                const concert = new Concert();
                concert.name = setlistItem.artist.name;
                // TODO: add more attributes
                return concert;
            });

            return concerts;
        } catch (error) {
            console.error('Error fetching setlists:', error);
            throw error; // Rethrow or handle error as appropriate for your application
        }
    }
}

export default ConcertService;
