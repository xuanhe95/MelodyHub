import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Track } from './track';

export class AlbumWithCover {

    id!: string;

    name!: string;  

    cover?: string;
    tracks!: Track[];
}

