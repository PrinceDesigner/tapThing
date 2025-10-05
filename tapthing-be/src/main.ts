import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { I18nValidationPipe, I18nValidationExceptionFilter, I18nService } from 'nestjs-i18n';
// import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });

  // Unica validation pipe (estende ValidationPipe) con messaggi localizzati
  app.useGlobalPipes(new I18nValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: true,
  }));

  // Filters: validazione + il nostro globale uniforme
  app.useGlobalFilters(
    new GlobalExceptionFilter(app.get(I18nService)),
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
