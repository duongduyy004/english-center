import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.listen(configService.get('app.port', { infer: true }));
}
bootstrap();
