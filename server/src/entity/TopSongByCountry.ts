import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { Artist } from './artist';
import { Concert } from './concert';
import { Track } from './track';

@Entity({ name: 'TOP_SONGS_BY_COUNTRY' })
export class TopSongByCountry {
    @PrimaryColumn({ name: 'spotify_id' })
    spotify_id!: string;

    @Column({ name: 'snapshot_date' })
    snapshot_date!: Date;

    @Column({ name: 'country' })
    country!: string;

    @Column({ name: 'daily_rank' })
    daily_rank!: number;
}
