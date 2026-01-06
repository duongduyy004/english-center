import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotificationGateway } from './notification.gateway'
import { NotificationEntity } from './entities/notification.entity'
import { SendNotificationDto } from './dto/send-notification.dto'
import { Expo, ExpoPushMessage } from 'expo-server-sdk'
import { UsersService } from 'modules/users/users.service'
import { NotificationType } from './types/notification.type'
import { formatDate, formatDateTime } from 'utils/date-utils'
import { NOTIFICATION_CONFIG } from './configs/notification-type.config'
import { NOTIFICATION_ENUM } from './types/notification-type.enum'
import { User } from 'modules/users/user.domain'
import { NotificationObjectEntity } from './entities/notification-object.entity'
import { NotificationRepository } from './notification.repository'
import { FilterNotificationDto, SortNotificationDto } from './dto/query-notification.dto'
import { IPaginationOptions } from 'utils/types/pagination-options'
import { PaginationResponseDto } from 'utils/types/pagination-response.dto'
import { Notification } from './notification.domain'

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationsRepository: Repository<NotificationEntity>,
        @InjectRepository(NotificationObjectEntity)
        private readonly notificationsObjectRepository: Repository<NotificationObjectEntity>,
        private readonly gateway: NotificationGateway,
        private readonly usersService: UsersService,
        private readonly notificationRepository: NotificationRepository
    ) { }


    async getNotificationByUserId(userId: User['id']) {
        const noti = await this.notificationsRepository.find({
            where: { recipientId: userId },
            relations: { object: true }
        })

        return noti
    }

    findAll({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterNotificationDto | null;
        sortOptions?: SortNotificationDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Notification>> {
        return this.notificationRepository.findManyWithPagination({
            filterOptions,
            sortOptions,
            paginationOptions,
        });
    }

    async markAsRead(id: Notification['id'], userId: User['id']) {
        return this.notificationRepository.markAsRead(id, userId);
    }

    async send(dto: SendNotificationDto, options: {
        isOnline: boolean
    }) {
        const { isOnline } = options

        const notifications = dto.recipientIds.map(item => (this.notificationsRepository.create({
            recipientId: item,
            object: {
                actorId: dto.actorId,
                data: dto.data
            }
        })))

        await this.notificationsRepository.save(notifications);


        if (isOnline) {
            notifications.map(noti => {
                this.gateway.sendToUser(noti.recipientId, noti.object)
            })
            return notifications;
        }
        else {
            return await this.sendExpoPush(dto, NOTIFICATION_ENUM.PAYMENT_REMINDER);
        }
    }

    async sendExpoPush(dto: SendNotificationDto, notificationType: NOTIFICATION_ENUM) {
        const pushTokens = (await this.usersService.getExpoPushTokensByUserIds(dto.recipientIds)).map(item => item.expoPushToken);

        const expo = new Expo();
        const messages: ExpoPushMessage[] = [];

        const config = NOTIFICATION_CONFIG[notificationType];
        for (const token of pushTokens) {
            // 1️⃣ Validate token
            if (!Expo.isExpoPushToken(token)) {
                console.warn('Invalid Expo token:', token)
                continue
            }

            messages.push({
                to: token,
                sound: 'default',
                title: config.title,
                body: this.processNotificationBody(dto.data, notificationType),
                data: dto.data.metadata ?? {},
                priority: 'high',
            })
        }

        const chunks = expo.chunkPushNotifications(messages)
        const tickets = []

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk)
            } catch (error) {
                console.error('Push send error:', error)
            }
        }

        return tickets
    }

    private processNotificationBody(notification: any, notificationType: number): string {
        switch (notificationType) {
            case 1: { // PAYMENT_REMINDER
                const { amount, studentName, month, year } = notification.body
                return `Học viên ${studentName} cần thanh toán ${amount.toLocaleString()}₫ cho tháng ${month}/${year}.`
            }

            case 2: { // PAYMENT_SUCCESS
                const { amount, paidAmount, studentName } = notification.body
                return `Học viên ${studentName} đã thanh toán ${paidAmount.toLocaleString()}₫ / ${amount.toLocaleString()}₫.`
            }

            case 3: { // STUDENT_ABSENT
                const { studentName, className, date } = notification.body
                return `Học viên ${studentName} vắng mặt tại lớp ${className} vào ngày ${formatDate(date)}.`
            }

            case 4: { // STUDENT_LATE
                const { studentName, className, date } = notification.body
                return `Học viên ${studentName} đi muộn buổi học ${className} vào ngày ${formatDate(date)}.`
            }

            case 5: { // CLASS_REMINDER
                const { className, date, duration } = notification.body
                return `Sắp đến giờ học ${className} (${duration}) lúc ${formatDateTime(date)}.`
            }

            default:
                // TypeScript sẽ cảnh báo nếu thiếu case
                return 'Bạn có một thông báo mới.'
        }
    }


}
