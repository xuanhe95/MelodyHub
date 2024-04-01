import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Track } from './track';

@Entity({ name: 'ALBUMS' })
export class Album {
    @PrimaryColumn({ name: 'album_id' })
    id!: string;

    @Column({ name: 'album' })
    name!: string;  
    
    @CreateDateColumn({ name: 'created_at' }) // Auto
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at' }) // Auto
    updated_at!: Date;

    // OneToMany relationship with Track
    @OneToMany(() => Track, track => track.album)
    tracks!: Track[];
}
