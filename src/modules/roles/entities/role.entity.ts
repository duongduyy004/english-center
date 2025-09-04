import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { Column, Entity, ManyToMany, PrimaryColumn, JoinTable } from 'typeorm';

@Entity('role')
export class RoleEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    name?: string;

    @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { cascade: false })
    @JoinTable({
        name: 'role_permission',
        joinColumn: { name: 'roleId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' }
    })
    permissions?: PermissionEntity[];
}
