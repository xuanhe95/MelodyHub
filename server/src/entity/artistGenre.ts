import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { Artist } from './artist';
import { Concert } from './concert';
import { Track } from './track';

@Entity({ name: 'ARTIST_GENRES' })
export class ArtistGenre {
    @PrimaryColumn()
    artist_id!: string;

    @Column()
    genre!: string;

    @ManyToOne(() => Artist, artist => artist.genres)
    artist!: Artist;
}

