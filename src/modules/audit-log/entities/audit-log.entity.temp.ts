import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ nullable: true })
    entityId: string;

    @Column()
    path: string;

    @Column()
    method: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)" })
    createdAt: Date;
}
