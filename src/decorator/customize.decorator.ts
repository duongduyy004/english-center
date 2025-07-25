import { I18nTranslations } from '@/generated/i18n.generated';
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE_KEY = 'response_message_key';
export const ResponseMessage = (message_key: Path<I18nTranslations>) => SetMetadata(RESPONSE_MESSAGE_KEY, message_key);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);