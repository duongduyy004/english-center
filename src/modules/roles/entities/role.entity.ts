import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name?: string;

    @Column({ default: true })
    isActive: boolean

    @Column({ default: 'test' })
    description: string;

    @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { cascade: false })
    @JoinTable({
        name: 'role_permission',
        joinColumn: { name: 'roleId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' }
    })
    permissions?: PermissionEntity[];
}
