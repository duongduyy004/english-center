import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('role')
export class RoleEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    name?: string;
}
