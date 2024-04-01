import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { Artist } from './artist';
import { Concert } from './concert';
import { Track } from './track';

@Entity({ name: 'SONG_RANKINGS' })
export class SongRanking {
    @PrimaryColumn()
    song_id!: string;

    @Column()
    snapshot_date!: Date;

    @Column()
    country!: string;

    @Column()
    daily_rank!: number;
}