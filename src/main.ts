import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ClassSerializerInterceptor } from '@nestjs/common';
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
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  )
  await app.listen(configService.get('app.port', { infer: true }));
}
bootstrap();
