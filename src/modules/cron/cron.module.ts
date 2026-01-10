import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { ClassesModule } from 'modules/classes/classes.module';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { PaymentEntity } from 'modules/payments/entities/payment.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClassesModule,
    TypeOrmModule.forFeature([SessionEntity, PaymentEntity])
  ],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule { }

