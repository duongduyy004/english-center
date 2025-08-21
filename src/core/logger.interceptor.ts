import { AuditLogService } from '@/modules/audit-log/audit-log.service';
import { User } from '@/modules/users/user.domain';
import { Injectable, Logger, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService, ClsServiceManager } from 'nestjs-cls';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
    private logger = new Logger(HttpLoggerInterceptor.name)
    constructor(
        private clsService: ClsService,
        private auditLogService: AuditLogService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const start = Date.now()
        const req = context.switchToHttp().getRequest<Request>()
        const res = context.switchToHttp().getResponse<Response>()
        let name = undefined;
        let email = undefined
        if (req?.user) {
            name = (req?.user as any)?.name;
            email = (req?.user as any)?.email;
        }
        const statusCode = res.statusCode
        const { method, originalUrl } = req;
        const userInfor = name && email ? `${name}:${email}` : 'Guest User';

        ClsServiceManager.getClsService().set('user', req.user);
        ClsServiceManager.getClsService().set('method', req.method);
        ClsServiceManager.getClsService().set('path', req.originalUrl);

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - start
                this.logger.log(
                    `${userInfor} ${method} ${originalUrl} ${statusCode} - ${duration}ms`
                );
            }),
            catchError((error) => {
                const duration = Date.now() - start;
                this.logger.error(`${userInfor} ${method} ${originalUrl} ${statusCode} - ${duration}ms - Error: ${error.message || 'Unknown error'}`)
                return throwError(() => error)
            })
        )
    }
}
