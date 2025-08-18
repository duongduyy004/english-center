import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AuditLogChangeEntity } from "./audit-log-change.entity";

@Entity()
export class AuditLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string

    @Column()
    userName: string;

    @Column()
    userEmail: string;

    @Column()
    userRole: string;

    @Column()
    entity: string;

    @Column()
    entityId: string;

    @Column()
    path: string;

    @Column()
    method: string;

    @OneToMany(() => AuditLogChangeEntity, changes => changes.auditLog, { cascade: true })
    changes: AuditLogChangeEntity[]
}
