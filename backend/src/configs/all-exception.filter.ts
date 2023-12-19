import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    if (exception instanceof HttpException) {
      if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
        console.error(
          'Exception for URL',
          request.url,
          request.headers,
          request.body,
        );
        console.error(exception.message);

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          path: request.url,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          message: exception.message,
        });
      }
    } else {
      console.error(
        'Exception for URL',
        request.url,
        request.headers,
        request.body,
      );
      console.error(exception['message'], exception['stack']);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        path: request.url,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        message: exception['message'],
        stack: exception['stack'],
      });
    }
  }
}
