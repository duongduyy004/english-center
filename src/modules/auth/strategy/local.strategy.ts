import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private i18nService: I18nService<I18nTranslations>
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new BadRequestException(this.i18nService.t('auth.INCORRECT'));
        }
        return user;
    }
}
