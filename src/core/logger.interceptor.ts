import { Injectable, Logger, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
    private logger = new Logger(HttpLoggerInterceptor.name)

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const start = Date.now();
        const req = context.switchToHttp().getRequest()
        const res = context.switchToHttp().getResponse()
        const { name, email } = req?.user
        const statusCode = res.statusCode
        const { method, originalUrl } = req;
        let loged = false

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - start
                this.logger.log(
                    `${name}:${email} ${method} ${originalUrl} ${statusCode} - ${duration}ms`
                );
                loged = true;
            }),
            catchError((error) => {
                const duration = Date.now() - start;
                this.logger.error(`${name}:${email} ${method} ${originalUrl} ${statusCode} - ${duration}ms - Error: ${error.message || 'Unknown error'}`)
                return throwError(() => error)
            })
        )
    }
}
