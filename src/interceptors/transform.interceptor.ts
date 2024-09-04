import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const isMetadata = context
          .switchToHttp()
          .getRequest()
          .route.path.includes('/metadata');

        return {
          statusCode: isMetadata
            ? undefined
            : context.switchToHttp().getResponse().statusCode,
          ...data,
        };
      }),
    );
  }
}
