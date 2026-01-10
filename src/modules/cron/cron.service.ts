import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClassesService } from 'modules/classes/classes.service';
import { AuditSubscriber } from 'subscribers/audit-log.subscriber';
import { NotificationsService } from 'modules/notifications/notifications.service';
import { NOTIFICATION_ENUM } from 'modules/notifications/types/notification-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { PaymentEntity } from 'modules/payments/entities/payment.entity';
import dayjs from '@/utils/dayjs.config';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly classesService: ClassesService,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(PaymentEntity) private readonly paymentRepository: Repository<PaymentEntity>,
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateClassStatusCron() {
    AuditSubscriber.skipAuditLog = true;
    this.logger.log('Automatically updating class status...');
    await this.classesService.updateClassStatus();
    AuditSubscriber.skipAuditLog = false;
    return 'Class status updated successfully.';
  }

  async updateClassStatusManual() {
    this.logger.log('Manually updating class status...');
    await this.classesService.updateClassStatus();
    return 'Class status updated successfully.';
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async sendClassReminders() {
    this.logger.log('Checking for upcoming classes...');

    const now = dayjs();
    const oneHourLater = now.add(1, 'hour');

    // Find sessions starting in the next hour
    const upcomingSessions = await this.sessionRepository.find({
      where: {
        date: Between(now.toDate(), oneHourLater.toDate())
      },
      relations: ['class', 'class.students', 'class.students.student', 'class.students.student.parent', 'class.teacher']
    });

    for (const session of upcomingSessions) {
      const recipientIds: string[] = [];

      // Collect parent IDs for students in this class
      for (const classStudent of session.class?.students || []) {
        if (classStudent.student?.parent?.id) {
          recipientIds.push(classStudent.student.parent.id);
        }
      }

      // Send notification to all parents
      if (recipientIds.length > 0) {
        const uniqueRecipientIds = Array.from(new Set(recipientIds));
        await this.notificationsService.send({
          actorId: null,
          recipientIds: uniqueRecipientIds,
          data: {
            id: NOTIFICATION_ENUM.CLASS_REMINDER,
            title: 'Sắp đến giờ học',
            entityName: 'class',
            body: {
              className: session.class.name,
              date: session.date,
              duration: '90 phút'
            },
            metadata: { entityId: session.id }
          }
        }, NOTIFICATION_ENUM.CLASS_REMINDER, { isOnline: false });

        this.logger.log(`Sent CLASS_REMINDER for session ${session.id} to ${uniqueRecipientIds.length} parents`);
      }
    }
  }

  @Cron('0 9 * * *') // Every day at 9:00 AM
  async sendPaymentReminders() {
    this.logger.log('Sending payment reminders...');

    const currentMonth = dayjs().month() + 1;
    const currentYear = dayjs().year();

    // Find unpaid or partially paid payments for the current month
    const unpaidPayments = await this.paymentRepository.find({
      where: {
        month: currentMonth,
        year: currentYear,
        status: In(['pending', 'partial'])
      },
      relations: ['student', 'student.parent', 'class']
    });

    for (const payment of unpaidPayments) {
      if (payment.student?.parent?.id) {
        await this.notificationsService.send({
          actorId: null,
          recipientIds: [payment.student.parent.id],
          data: {
            id: NOTIFICATION_ENUM.PAYMENT_REMINDER,
            title: 'Nhắc nhở thanh toán học phí',
            entityName: 'payments',
            body: {
              amount: payment.totalAmount - payment.paidAmount,
              studentName: payment.student.name,
              month: payment.month,
              year: payment.year
            },
            metadata: { entityId: payment.id }
          }
        }, NOTIFICATION_ENUM.PAYMENT_REMINDER, { isOnline: false });

        this.logger.log(`Sent PAYMENT_REMINDER for student ${payment.student.name}`);
      }
    }
  }
}
