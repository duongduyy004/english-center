import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuditLogEntity } from "./audit-log.entity";

@Entity()
export class AuditLogChangeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fieldName: string;

    @Column({ nullable: true })
    oldValue: string;

    @Column({ nullable: false })
    newValue: string;

    @ManyToOne(() => AuditLogEntity, auditLog => auditLog.changes)
    @JoinColumn({ name: 'auditLogId' })
    auditLog: AuditLogEntity;
}