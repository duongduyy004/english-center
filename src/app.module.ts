import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@/database/typeorm-config.service';
import { UsersModule } from 'modules/users/users.module';
import databaseConfig from '@/config/configs/database.config';
import appConfig from '@/config/configs/app.config';
import jwtConfig from '@/config/configs/jwt.config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
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
import { CaslModule } from './modules/casl/casl.module';
import { PoliciesGuard } from './modules/auth/guard/policies.guard';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/logger/logger.config';
import { HttpLoggerInterceptor } from './core/logger.interceptor';
import { MenuModule } from '@/modules/menus/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, jwtConfig],
      envFilePath: ['.env']
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'i18n'),
        watch: true,
      },
      typesOutputPath: path.join(process.cwd(), 'src', 'generated', 'i18n.generated.ts'),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-lang'] },
        AcceptLanguageResolver,
      ]
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    WinstonModule.forRoot(winstonConfig),
    UsersModule,
    StudentsModule,
    ParentsModule,
    TeachersModule,
    ClassesModule,
    PaymentsModule,
    SessionsModule,
    TeacherPaymentsModule,
    AuthModule,
    CaslModule,
    MenuModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor
    }
  ],
})

export class AppModule { }
