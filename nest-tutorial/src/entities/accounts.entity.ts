import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('accounts')
export class AccountsEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    permission: string;

}