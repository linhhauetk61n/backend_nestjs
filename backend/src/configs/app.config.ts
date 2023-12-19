import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { AllExceptionFilter } from './all-exception.filter';

type Options = {
  validationOptions?: ValidationPipeOptions;
};

export const AppConfig = (
  app: INestApplication,
  options: Options,
): INestApplication => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      ...options.validationOptions,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  return app;
};
