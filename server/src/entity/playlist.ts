import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { PlaylistSong } from './playlistSong';
import { User } from '../models/user';

@Entity()
export class Playlist {
    @PrimaryColumn() // Do not auto-generate this column.
    id!: string;

    @Column()
    name!: string;

    @Column()
    user: User | undefined;

    @OneToMany(() => PlaylistSong, playlistSong => playlistSong.playlist)
    playlistSongs!: PlaylistSong[];
    
}
