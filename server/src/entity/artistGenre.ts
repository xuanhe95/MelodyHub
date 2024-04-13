import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Artist } from './artist';
import { Concert } from './concert';
import { Track } from './track';

@Entity({ name: 'ARTIST_GENRES' })
export class ArtistGenre {
    @PrimaryColumn()
    artist_id!: string;

    @PrimaryColumn()
    genre!: string;

    @ManyToOne(() => Artist, artist => artist.genres)
    @JoinColumn({ name: 'artist_id' })
    artist!: Artist;
}

