import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Playlist } from './playlist';
import { Track } from './track';
import { Artist } from './artist';

@Entity({ name: 'PLAYLIST_SONGS' })
export class PlaylistSong {
    // Composite primary key: part 1
    @PrimaryColumn({ name: 'playlist_id' })
    playlistId!: string;

    // Composite primary key: part 2
    @PrimaryColumn({ name: 'song_id' })
    trackId!: string;

    @Column({ name: 'year' })
    year!: number;

    @ManyToOne(() => Playlist, playlist => playlist.playlistSongs)
    @JoinColumn({ name: 'playlist_id' })
    playlist!: Playlist;

    @ManyToOne(() => Track, track => track.playlistSongs)
    @JoinColumn({ name: 'song_id' })
    track!: Track;

    @ManyToOne(() => Artist, artist => artist.playlistSongs)
    @JoinColumn({ name: 'artist_id' })
    artist!: Artist;
}
