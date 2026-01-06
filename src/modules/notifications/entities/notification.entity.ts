import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationObjectEntity } from "./notification-object.entity";

@Entity('notification')
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    recipientId: string;

    @ManyToOne(() => NotificationObjectEntity, (obj) => obj.notification, {
        cascade: true,
    })
    object: NotificationObjectEntity;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date
}