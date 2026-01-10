import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { NotificationType } from '../types/notification.type';
import { NOTIFICATION_ENUM } from '../types/notification-type.enum';

@Entity('notification_object')
export class NotificationObjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'jsonb' })
    data: NotificationType

    @Column({ default: NOTIFICATION_ENUM.STUDENT_LATE })
    type: NOTIFICATION_ENUM

    @OneToMany(() => NotificationEntity, (noti) => noti.object)
    notification: NotificationEntity[];

    @Column({ nullable: true })
    actorId: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;
}
