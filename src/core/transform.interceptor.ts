import { RESPONSE_MESSAGE_KEY } from '@/decorator/customize.decorator';
import { I18nTranslations } from '@/generated/i18n.generated';
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number;
    data: any;
    message: string
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(
        private reflector: Reflector,
        private i18nService: I18nService<I18nTranslations>
    ) { }
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const message_key = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler())
        return next
            .handle()
            .pipe(
                map((data) => ({
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: message_key ? this.i18nService.t(message_key as keyof I18nTranslations) : '',
                    data
                })),
            );
    }
}