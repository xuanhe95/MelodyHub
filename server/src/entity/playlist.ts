import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { PlaylistSong } from './playlistSong';

@Entity()
export class Playlist {
    @PrimaryColumn() // Do not auto-generate this column.
    id!: string;

    @OneToMany(() => PlaylistSong, playlistSong => playlistSong.playlist)
    playlistSongs!: PlaylistSong[];
}
