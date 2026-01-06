import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { RoleEnum } from 'modules/roles/roles.enum';
import { NotificationType } from '../types/notification.type';

export class SendNotificationDto {
    @IsOptional()
    actorId: string

    @IsArray()
    @IsNotEmpty()
    recipientIds: string[]

    @IsNotEmpty()
    data: NotificationType
}
