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

    async test(): Promise<void> {
        try{

            const anotherresponse = await fetch(`https://api.setlist.fm/rest/1.0/artist/20244d07-534f-4eff-b4d4-930878889970/setlists?p=1`, {
              method: 'GET',
              headers: {
                'x-api-key': '5ubATn-IrvFIN31uEeFe-bPZw7EKBTaxpQYs',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            console.log('Another Response:', anotherresponse);
        } catch (error) {
            console.error('Error fetching setlists:', error);
            throw error;
        }}
}



export default ConcertService;
