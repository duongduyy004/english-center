import { AuditLogAction } from "subscribers/audit-log.constants";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

interface AuditValue {
    [key: string]: any
}

@Entity('audit_log')
export class AuditLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    userId: string

    @Column({ nullable: true, default: 'Guest User' })
    userName: string;

    @Column({ nullable: true })
    userEmail: string;

    @Column({ nullable: true })
    userRole: string;

    @Column()
    entityName: string;

    @Column({ nullable: true })
    entityId: string;

    @Column()
    path: string;

    @Column()
    description: string;

    @Column()
    method: string;

    @Column()
    action: AuditLogAction;

    @Column("text", { array: true })
    changedFields: string[];

    @Column({ type: 'jsonb', nullable: true })
    oldValue: AuditValue

    @Column({ type: 'jsonb', nullable: true })
    newValue: AuditValue

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;
}
