import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ReleaseBy } from './releaseBy';
import { ArtistGenre } from './artistGenre';
import { PlaylistSong } from './playlistSong';

@Entity({ name: 'ARTISTS' }) // Maps to 'ARTISTS' table in db
export class Artist {
    @PrimaryColumn({ name: 'artist_id' })
    id!: string; // match the primary key of 'ARTISTS'

    @Column({ name: 'artist' })
    name!: string; // column 'artist'

    @CreateDateColumn({ name: 'created_at' }) // Automatically set when inserting a new record
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at' }) // Automatically updated when the record is updated
    updated_at!: Date;

    @OneToMany(() => ReleaseBy, releaseBy => releaseBy.artist)
    releaseBys!: ReleaseBy[]; 

    @OneToMany(() => ArtistGenre, artistGenre => artistGenre.artist)
    genres!: ArtistGenre[];

    @OneToMany(() => PlaylistSong, playlistSong => playlistSong.artist)
    playlistSongs!: PlaylistSong[];
}
