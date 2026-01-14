import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RoleSeedModule } from './role/role-seed.module';
import { AdminUserSeedModule } from './admin/admin-user-seed.module';
import databaseConfig from '@/config/configs/database.config';
import appConfig from '@/config/configs/app.config';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { ClassSeedModule } from './class/class-seed.module';
import { StudentSeedModule } from './student/student-seed.module';
import { TeacherSeedModule } from './teacher/teacher-seed.module';
import { ParentSeedModule } from './parent/parent-seed.module';
import { MenuSeedModule } from './menu/menu-seed.module';
import { PermissionSeedModule } from './permission/permission-seed.module';
import { RegistrationSeedModule } from './registration/registration-seed.module';
import { SessionSeedModule } from './session/session-seed.module';
import { PaymentsModule } from 'modules/payments/payments.module';
import { TeacherPaymentsModule } from 'modules/teacher-payments/teacher-payments.module';
import { ClassesModule } from 'modules/classes/classes.module';
import { StudentsModule } from 'modules/students/students.module';
import { UsersModule } from 'modules/users/users.module';
import jwtConfig from 'config/configs/jwt.config';
import redisConfig from 'config/configs/redis.config';
import cloudinaryConfig from 'config/configs/cloudinary.config';
import paymentConfig from 'config/configs/payment.config';
import mailerConfig from 'config/configs/mailer.config';
import otpConfig from 'config/configs/otp.config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'logger/logger.config';
import { ClsModule } from 'nestjs-cls';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ParentsModule } from 'modules/parents/parents.module';
import { TeachersModule } from 'modules/teachers/teachers.module';
import { SessionsModule } from 'modules/sessions/sessions.module';
import { TransactionsModule } from 'modules/transactions/transactions.module';
import { MenuModule } from 'modules/menus/menu.module';
import { RegistrationsModule } from 'modules/registrations/registrations.module';
import { FilesModule } from 'modules/files/files.module';
import { AdvertisementsModule } from 'modules/advertisements/advertisements.module';
import { FeedbackModule } from 'modules/feedback/feedback.module';
import { IntroductionModule } from 'modules/introduction/introduction.module';
import { PermissionsModule } from 'modules/permissions/permissions.module';
import { RolesModule } from 'modules/roles/roles.module';
import { ArticlesModule } from 'modules/articles/articles.module';
import { FooterSettingsModule } from 'modules/footer-settings/footer-settings.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';

@Module({
    imports: [
        RoleSeedModule,
        AdminUserSeedModule,
        ClassSeedModule,
        StudentSeedModule,
        TeacherSeedModule,
        ParentSeedModule,
        MenuSeedModule,
        PermissionSeedModule,
        RegistrationSeedModule,
        SessionSeedModule,
        UsersModule,
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
        ScheduleModule.forRoot(),
        HttpModule.registerAsync({
            useFactory: () => ({
                timeout: 5000,
                maxRedirects: 5
            })
        }),
        UsersModule,
        StudentsModule,
        ParentsModule,
        TeachersModule,
        ClassesModule,
        PaymentsModule,
        SessionsModule,
        MenuModule,
        TransactionsModule,
        RegistrationsModule,
        FilesModule,
        FeedbackModule,
        IntroductionModule,
        PermissionsModule,
        RolesModule,
        ArticlesModule,
        FooterSettingsModule,
        NotificationsModule
    ],
})
export class SeedModule { }
