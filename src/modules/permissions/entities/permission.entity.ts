import { RoleEntity } from "@/modules/roles/entities/role.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('permissions')
export class PermissionEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    path: string;

    @Column()
    method: string;

    @Column()
    description: string;

    @Column()
    module: string;

    @Column()
    version: number

    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
