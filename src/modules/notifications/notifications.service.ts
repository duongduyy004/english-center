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

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationsRepository: Repository<NotificationEntity>,
        private readonly gateway: NotificationGateway,
        private readonly usersService: UsersService
    ) { }

    async send(dto: SendNotificationDto, options: {
        isOnline: boolean
    }) {
        const { isOnline } = options

        const notifications = dto.notifierIds.map(item => (this.notificationsRepository.create({
            notifierId: item,
            object: {
                actorId: dto.actorId,
                data: dto.data
            }
        })))

        // await this.notificationsRepository.save(notifications);


        if (isOnline) {
            notifications.map(noti => {
                this.gateway.sendToUser(noti.notifierId, noti.object)
            })
            return notifications;
        }
        else {
            console.log('check send expo', isOnline)
            return await this.sendExpoPush(dto, NOTIFICATION_ENUM.PAYMENT_REMINDER);
        }
    }

    async sendExpoPush(dto: SendNotificationDto, notificationType: NOTIFICATION_ENUM) {
        const pushTokens = (await this.usersService.getExpoPushTokensByUserIds(dto.notifierIds)).map(item => item.expoPushToken);

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
        console.log('check message', messages[0])

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
