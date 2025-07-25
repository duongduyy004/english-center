import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@/database/typeorm-config.service';
import { UsersModule } from '@/modules/users/users.module';
import databaseConfig from '@/config/configs/database.config';
import appConfig from '@/config/configs/app.config';
import jwtConfig from '@/config/configs/jwt.config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '@/core/transform.interceptor';
import { StudentsModule } from '@/modules/students/students.module';
import { ParentsModule } from '@/modules/parents/parents.module';
import { TeachersModule } from '@/modules/teachers/teachers.module';
import { ClassesModule } from '@/modules/classes/classes.module';
import { PaymentsModule } from '@/modules/payments/payments.module';

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
        path: path.join(process.cwd(), 'src', 'i18n'), // Use process.cwd() instead
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
    UsersModule,
    StudentsModule,
    ParentsModule,
    TeachersModule,
    ClassesModule,
    PaymentsModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }

  ],
})
export class AppModule { }
