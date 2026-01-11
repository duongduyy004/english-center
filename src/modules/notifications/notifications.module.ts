import { Global, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationObjectEntity } from './entities/notification-object.entity';
import { NotificationGateway } from './notification.gateway';
import { UsersModule } from 'modules/users/users.module';
import { NotificationRepository } from './notification.repository';
import { NotificationMapper } from './notification.mapper';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([
    NotificationEntity,
    NotificationObjectEntity
  ]),
    UsersModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationGateway, NotificationRepository, NotificationMapper],
  exports: [NotificationsService]
})
export class NotificationsModule { }
