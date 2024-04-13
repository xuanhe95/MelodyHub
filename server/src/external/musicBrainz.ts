import axios from 'axios';

const COMMON_HEADERS = {
    'User-Agent': 'MelodyTracker/1.0.0 ( teamMelon@gmail.com )'
};


// Get album cover by https://musicbrainz.org/doc/Cover_Art_Archive/API
// Removing error log since album not found in search is common and it would spam the server log.
export async function getAlbumCover(albumName: string): Promise<string> {
    const albumMid = await getAlbumMbid(albumName)

    if (albumMid === '') {
        return ''; // return empty if no albums found with the name
    }

    const url = `https://coverartarchive.org/release-group/${albumMid}`;
    try {
        const response = await axios.get(url, { headers: COMMON_HEADERS });
        if (response.status !== 200) {
            //console.log(`Unexpected status code: ${response.status}, data ${response.data}`);
            return '';
        }
        const coverImage = response.data.images[0].image;
        return coverImage;
    } catch (error) {
        //console.log("Error fetching album cover:", error);
        return ''; // return empty if any error happens
    }
}

// This calls the search endpoint of MusicBrainz_API (https://musicbrainz.org/doc/MusicBrainz_API).
// The search isn't exact match of the album name so there could be zero or multiple results. 
// For convenience purpose (since the actuaray isn't important in this demo project), 
// We always take the first result and fetch cover images for that result. 
// This fuction returns the mbid of the album (or release-group), which is an internally used id defined by MusicBrainz.
// The returned id is used futher to fetch the cover image url in a slightly different web API. https://coverartarchive.org/
// Please keep this function private.
async function getAlbumMbid(query: string): Promise<string> {
    const url = `https://musicbrainz.org/ws/2/release-group/?query=release:${encodeURIComponent(query)}&fmt=json`;

    try {
        const response = await axios.get(url, { headers: COMMON_HEADERS });
        if (response.status !== 200) {
            //console.log(`Unexpected status code: ${response.status}, data ${response.data}`);
            return '';
        }

        const releaseGroups = response.data['release-groups'];
        return releaseGroups && releaseGroups.length > 0 ? releaseGroups[0].id : 'None';
    } catch (error) {
        //console.log("Error fetching release group ID from MusicBrainz:", error);
        return '';
    }
}

