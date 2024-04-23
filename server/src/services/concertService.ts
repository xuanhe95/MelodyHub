import { Concert } from '../entity/concert';

class ConcertService {
    async fetchArtistSetlists(mbid: string, page: number): Promise<{ concerts: Concert[], totalPages: number }> {
        try {
            const response = await fetch(`https://api.setlist.fm/rest/1.0/artist/${mbid}/setlists?p=${page}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'x-api-key': '5ubATn-IrvFIN31uEeFe-bPZw7EKBTaxpQYs'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    

            const data = await response.json();
            const totalSetlists = data.total;
            const totalPages = Math.ceil(totalSetlists / 20); // 20 setlists per page
            const setlists = data.setlist;
            //console.log(mbid);
            //console.log(page);
            //console.log(data);
            const concerts: Concert[] = setlists.map((setlistItem: any) => {
                const concert = new Concert();
                concert.name = setlistItem.artist.name || "unkonwn";
                concert.venue = setlistItem.venue.name;
                concert.city = setlistItem.venue.city.name;
                concert.state = setlistItem.venue.city.state;
                concert.country = setlistItem.venue.city.country.name;
                concert.date = setlistItem.eventDate;
                //concert.tour = setlistItem.tour.name;
                concert.url = setlistItem.url;
                return concert;
            });

            return { concerts, totalPages };
        } catch (error) {
            console.error('Error fetching setlists:', error);
            throw error;
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
