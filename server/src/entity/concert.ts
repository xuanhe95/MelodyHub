import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Track } from './track';
import { Artist } from './artist';

@Entity({ name: 'CONCERTS' }) // This should match the table name in your database
export class Concert {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    date!: Date; // Assuming 'date' is a DATE type column

    @Column()
    tour!: string;

    @Column()
    venue!: string;

    @Column()
    location!: string;

    @Column({ type: 'json' })
    set_list!: any; // 'set_list' can store a JSON object if your database supports it

    // Assuming you have Track and Artist entities defined elsewhere
    @ManyToMany(() => Track)
    @JoinTable()
    tracks!: Track[];

    @ManyToMany(() => Artist)
    @JoinTable()
    artists!: Artist[];

}
