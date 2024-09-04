import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserNotFoundException } from '../exceptions/user-not-found';

const ignoredErrors = [UserNotFoundException];

const enableSentry = (err, extra) => {
  const ignoreSentry = ignoredErrors.some(
    (errorType) => err instanceof errorType,
  );
  if (!ignoreSentry) {
    Sentry.captureException(err, { extra });
  }
  return throwError(err);
};

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const body = request.body;
    const url = request.url;
    const userId = (request as any).user?.id;

    return next
      .handle()
      .pipe(
        catchError((err) => enableSentry(err, { url, method, userId, body })),
      );
  }
}
