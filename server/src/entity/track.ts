import {
	Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn
} from 'typeorm';
import { Album } from './album';
import { ReleaseBy } from './releaseBy';
import { PlaylistSong } from './playlistSong';

@Entity({ name: 'SONGS' })
export class Track {
	@PrimaryColumn()
    id!: string;

	@Column({ name: 'name' })
	title!: string;

	@Column({ name: 'tempo', type: 'double' })
	tempo!: number;

	@Column({ name: 'danceability', type: 'double' })
	danceability!: number;

	@Column({ name: 'release_date' })
	release_date!: Date;

	@Column({ name: 'energy', type: 'double' })
	energy!: number;

	@Column({ name: 'duration' })
	duration!: number;

    @Column({ name: 'disc_number' })
	disc_number!: number;

    @Column({ name: 'track_number' })
	track_number!: number;

	@CreateDateColumn({ name: 'created_at' }) // Automatically set when inserting a new record
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at' }) // Automatically updated when the record is updated
    updated_at!: Date;

    @ManyToOne(() => Album, album => album.tracks)
    @JoinColumn({ name: 'album_id' })
    album!: Album;

    @OneToMany(() => ReleaseBy, releaseBy => releaseBy.track)
    releaseBys!: ReleaseBy[];

    @OneToMany(() => PlaylistSong, playlistSong => playlistSong.track)
    playlistSongs!: PlaylistSong[];
}
