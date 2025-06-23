import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import { AllHttpExceptionFilter } from './exception/http-exception.filter';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { TransformResponseInterceptor } from './interceptor/transform-response.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllHttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  // app.useLogger(false);
  // app.useLogger(['log', 'error']);
  app.use(new LoggerMiddleware().use);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
