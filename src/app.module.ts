import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@/database/typeorm-config.service';
import { UsersModule } from 'modules/users/users.module';
import databaseConfig from '@/config/configs/database.config';
import appConfig from '@/config/configs/app.config';
import jwtConfig from '@/config/configs/jwt.config';
import redisConfig from '@/config/configs/redis.config';
import cloudinaryConfig from '@/config/configs/cloudinary.config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '@/core/transform.interceptor';
import { StudentsModule } from 'modules/students/students.module';
import { ParentsModule } from 'modules/parents/parents.module';
import { TeachersModule } from 'modules/teachers/teachers.module';
import { ClassesModule } from 'modules/classes/classes.module';
import { PaymentsModule } from 'modules/payments/payments.module';
import { SessionsModule } from 'modules/sessions/sessions.module';
import { TeacherPaymentsModule } from 'modules/teacher-payments/teacher-payments.module';
import { AuthModule } from 'modules/auth/auth.module';
import * as path from 'path';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/logger/logger.config';
import { HttpLoggerInterceptor } from './core/logger.interceptor';
import { MenuModule } from '@/modules/menus/menu.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { ClsModule } from 'nestjs-cls';
import { BullModule } from '@nestjs/bullmq';
import { RedisConfigService } from './database/redis-config.service';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { FilesModule } from './modules/files/files.module';
import { AdvertisementsModule } from './modules/advertisements/advertisements.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { IntroductionModule } from './modules/introduction/introduction.module';
import { RolesGuard } from 'modules/roles/roles.guard';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ArticlesModule } from './modules/articles/articles.module';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from 'modules/cron/cron.module';
import { HttpModule } from '@nestjs/axios';
import { CacheConfigService } from 'cache/cache-config.service';
import paymentConfig from 'config/configs/payment.config';
import mailerConfig from 'config/configs/mailer.config';
import otpConfig from 'config/configs/otp.config';
import { OtpModule } from 'modules/otp/otp.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        appConfig,
        jwtConfig,
        redisConfig,
        cloudinaryConfig,
        paymentConfig,
        mailerConfig,
        otpConfig
      ],
      envFilePath: ['.env'],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'i18n'),
        watch: true,
      },
      typesOutputPath: path.join(
        process.cwd(),
        'src',
        'generated',
        'i18n.generated.ts',
      ),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-lang'] },
        AcceptLanguageResolver,
      ],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource;
      }
    }),
    WinstonModule.forRoot(winstonConfig),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    // BullModule.forRootAsync({
    //   useClass: RedisConfigService,
    // }),
    ScheduleModule.forRoot(),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5
      })
    }),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useClass: CacheConfigService
    // }),
    UsersModule,
    StudentsModule,
    ParentsModule,
    TeachersModule,
    ClassesModule,
    PaymentsModule,
    SessionsModule,
    TeacherPaymentsModule,
    AuthModule,
    MenuModule,
    TransactionsModule,
    AuditLogModule,
    RegistrationsModule,
    FilesModule,
    AdvertisementsModule,
    DashboardModule,
    FeedbackModule,
    IntroductionModule,
    PermissionsModule,
    RolesModule,
    ArticlesModule,
    CronModule,
    OtpModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
  ],
})
export class AppModule { }
