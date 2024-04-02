import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Playlist } from './playlist'; 

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column({ select: false })
    password!: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    last_login_at!: Date;

    // Add this property to establish the one-to-many relationship with Playlist
    @OneToMany(() => Playlist, playlist => playlist.user)
    playlists!: Playlist[];

    constructor(init?: Partial<User>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}
