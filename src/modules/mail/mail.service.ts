import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "config/config.type";
import { MailerService } from "modules/mailer/mailer.service";
import { MailData } from "./mail.interface";
import path from "path";
import dayjs from "dayjs";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "generated/i18n.generated";
import { MaybeType } from "utils/types/maybe.type";

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private configService: ConfigService<AllConfigType>,
        private i18nService: I18nService<I18nTranslations>,
    ) { }

    async verifyEmail(mailData: MailData<{ token: string }>) {
        let title: MaybeType<string>;
        let text1: MaybeType<string>;
        let text2: MaybeType<string>;
        let text3: MaybeType<string>;

        const app_name = this.configService.get('app.name', { infer: true });
        const expirationTime = this.configService.get('jwt.jwt_verify_email_expiration_minutes', { infer: true });

        [title, text1, text2, text3] = await Promise.all([
            this.i18nService.t('verify-email.TITLE'),
            this.i18nService.t('verify-email.TEXT_1', {
                args: { app_name }
            }),
            this.i18nService.t('verify-email.TEXT_2'),
            this.i18nService.t('verify-email.TEXT_3', {
                args: { expirationTime: expirationTime.substring(0, expirationTime.length - 1) }
            })
        ])

        const url = new URL(this.configService.get('app.frontendDomain', { infer: true }) + '/verify-email');
        url.searchParams.set('token', mailData.data.token);

        await this.mailerService.sendMail({
            to: mailData.to,
            subject: title,
            text: `${url.toString()} ${title}`,
            templatePath: path.join(process.cwd(), 'src', 'modules', 'mail', 'mail-templates', 'verify-email.template.hbs'),
            context: {
                title: title,
                url: url.toString(),
                actionTitle: title,
                app_name,
                text1,
                text2,
                text3,
                currentYear: dayjs().year()
            }
        })
    }

    async forgotPassword(mailData: MailData<{ token: string }>) {
        let title: MaybeType<string>;
        let text1: MaybeType<string>;
        let text2: MaybeType<string>;
        let text3: MaybeType<string>;
        let text4: MaybeType<string>;
        const app_name = this.configService.get('app.name', { infer: true });
        const expirationTime = this.configService.get('jwt.jwt_reset_password_expiration_minutes', { infer: true });

        [title, text1, text2, text3, text4] = await Promise.all([
            this.i18nService.t('forgot-password.TITLE'),
            this.i18nService.t('forgot-password.TEXT_1', {
                args: { app_name }
            }),
            this.i18nService.t('forgot-password.TEXT_2'),
            this.i18nService.t('forgot-password.TEXT_3', {
                args: { expirationTime: expirationTime.substring(0, expirationTime.length - 1) }
            }),
            this.i18nService.t('forgot-password.TEXT_4')
        ])

        const url = new URL(this.configService.get('app.frontendDomain', { infer: true }) + '/forgot-password');
        url.searchParams.set('token', mailData.data.token);

        await this.mailerService.sendMail({
            to: mailData.to,
            subject: title,
            text: `${url.toString()} ${title}`,
            templatePath: path.join(process.cwd(), 'src', 'modules', 'mail', 'mail-templates', 'forgot-password.template.hbs'),
            context: {
                title: title,
                url: url.toString(),
                actionTitle: title,
                app_name,
                text1,
                text2,
                text3,
                text4,
                currentYear: dayjs().year()
            }
        })
    }
}