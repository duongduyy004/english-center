import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

interface AuditValue {
    [key: string]: any
}

@Entity('audit')
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
    entityName: string;

    @Column({ nullable: true })
    entityId: string;

    @Column()
    path: string;

    @Column()
    method: string;

    @Column("text", { array: true })
    changedFields: string[];

    @Column({ type: 'jsonb' })
    oldValue: AuditValue

    @Column({ type: 'jsonb' })
    newValue: AuditValue

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}
