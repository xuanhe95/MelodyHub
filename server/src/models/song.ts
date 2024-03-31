// song.model.ts
export interface Song {
    id: string;
    title: string;
    tempo?: number;
    danceability?: number;
    release_date?: Date;
    energy?: number;
    duration?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }
  

  
  // songAlbum.model.ts
  export interface SongAlbumMapping {
    song_id: string;
    album_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }
  
  // artist.model.ts
  export interface Artist {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }
  
  // releasedBy.model.ts
  export interface ReleasedBy {
    song_id: string;
    artist_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }
  
  // playlist.model.ts
  export interface Playlist {
    id: string;
    year: number;
    track_id: string;
    track_name: string;
    track_popularity: number;
    artist_id: string;
    artist_popularity: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }
  
  // topSongCountry.model.ts
  export interface TopSongCountry {
    song_id: string;
    date: Date;
    country: string;
    daily_rank: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }
  
  // userPlaylist.model.ts
  export interface UserPlaylist {
    user_id: string;
    playlist_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }
  
