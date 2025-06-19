import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class categoriesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryName: string;

    @Column()
    description: string;
}