import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Notification } from '../notification.domain';

export class FilterNotificationDto {
    @IsOptional()
    @IsString()
    recipientId?: string;

    @IsOptional()
    @IsString()
    isRead?: boolean;
}

export class SortNotificationDto {
    @IsString()
    orderBy: keyof Notification;

    @IsEnum(['ASC', 'DESC'])
    order: 'ASC' | 'DESC';
}
