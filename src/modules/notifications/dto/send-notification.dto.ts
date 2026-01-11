import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { NotificationType } from '../types/notification.type';
import { NOTIFICATION_ENUM } from '../types/notification-type.enum';

export class SendNotificationDto {
    @IsOptional()
    actorId: string

    @IsArray()
    @IsNotEmpty()
    recipientIds: string[]

    @IsNotEmpty()
    data: NotificationType

    @IsEnum(NOTIFICATION_ENUM)
    @IsNotEmpty()
    notificationType: NOTIFICATION_ENUM
}
