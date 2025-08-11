import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('menu')
export class MenuEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
