import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const configService = app.get(ConfigService<AllConfigType>);
  app.useGlobalPipes(new I18nValidationPipe({
    stopAtFirstError: true,
    transform: true
  }));
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter(errors) {
        return Object.values(errors.at(0).constraints).at(0) as unknown as object
      },
    }),
  );

  //config cookie
  app.use(cookieParser())

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  )
  app.enableCors({
    origin: [configService.get('app.frontendDomain', { infer: true }), 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  //config versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: ['1']
  })
  await app.listen(configService.get('app.port', { infer: true }));
}
bootstrap();
