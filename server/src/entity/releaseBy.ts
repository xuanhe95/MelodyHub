import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Track } from './track';
import { Artist } from './artist';

@Entity({ name: 'RELEASE_BY' }) // This should match the table name in your database
export class ReleaseBy {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Track, track => track.releaseBys)
    @JoinColumn({ name: 'song_id' }) // This should match the column name in your RELEASE_BY table
    track!: Track;

    @ManyToOne(() => Artist, artist => artist.releaseBys)
    @JoinColumn({ name: 'artist_id' }) // This should match the column name in your RELEASE_BY table
    artist!: Artist;
}
