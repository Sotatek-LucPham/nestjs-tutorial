import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class ProductsEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productName: string;

    @Column()
    price: number;

    @Column()
    categoryId: number;

}