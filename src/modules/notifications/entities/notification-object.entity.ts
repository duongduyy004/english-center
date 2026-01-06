import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { NotificationType } from '../types/notification.type';

@Entity('notification_object')
export class NotificationObjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'jsonb' })
    data: NotificationType

    @OneToMany(() => NotificationEntity, (noti) => noti.object)
    notification: NotificationEntity[];

    @Column({ nullable: true })
    actorId: string;

    @CreateDateColumn()
    createdAt: Date;
}
