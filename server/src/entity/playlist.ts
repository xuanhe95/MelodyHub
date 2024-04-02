import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { PlaylistSong } from './playlistSong';
import { User } from './user';

@Entity()
export class Playlist {
    @PrimaryColumn()
    playlist_id!: string;

    @Column()
    year!: number;

    @Column()
    name!: string;

    // many-to-one relationship between Playlist and User
    @ManyToOne(() => User, user => user.playlists) 
    user!: User;

    @OneToMany(() => PlaylistSong, playlistSong => playlistSong.playlist)
    playlistSongs!: PlaylistSong[];

}
