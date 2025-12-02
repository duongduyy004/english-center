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

    async verifyEmail(mailData: MailData<{ otp: string }>) {
        let title: MaybeType<string>;
        let text1: MaybeType<string>;
        let text2: MaybeType<string>;
        let text3: MaybeType<string>;

        const app_name = this.configService.get('app.name', { infer: true });
        const expirationTime = this.configService.get('otp.period', { infer: true });

        [title, text1, text2, text3] = await Promise.all([
            this.i18nService.t('verify-email.TITLE'),
            this.i18nService.t('verify-email.TEXT_1', {
                args: { app_name }
            }),
            this.i18nService.t('verify-email.TEXT_2'),
            this.i18nService.t('verify-email.TEXT_3', {
                args: { expirationTime: expirationTime / 60 }
            })
        ])


        await this.mailerService.sendMail({
            to: mailData.to,
            subject: title,
            text: `${title}`,
            templatePath: path.join(process.cwd(), 'src', 'modules', 'mail', 'mail-templates', 'verify-email.template.hbs'),
            context: {
                title: title,
                otp: mailData.data.otp,
                actionTitle: title,
                app_name,
                text1,
                text2,
                text3,
                currentYear: dayjs().year()
            }
        })
    }

    async forgotPassword(mailData: MailData<{ otp: string }>) {
        let title: MaybeType<string>;
        let text1: MaybeType<string>;
        let text2: MaybeType<string>;
        let text3: MaybeType<string>;
        let text4: MaybeType<string>;
        const app_name = this.configService.get('app.name', { infer: true });
        const expirationTime = this.configService.get('otp.period', { infer: true });

        [title, text1, text2, text3, text4] = await Promise.all([
            this.i18nService.t('forgot-password.TITLE'),
            this.i18nService.t('forgot-password.TEXT_1', {
                args: { app_name }
            }),
            this.i18nService.t('forgot-password.TEXT_2'),
            this.i18nService.t('forgot-password.TEXT_3', {
                args: { expirationTime: expirationTime / 60 }
            }),
            this.i18nService.t('forgot-password.TEXT_4')
        ])

        await this.mailerService.sendMail({
            to: mailData.to,
            subject: title,
            text: `${title}`,
            templatePath: path.join(process.cwd(), 'src', 'modules', 'mail', 'mail-templates', 'forgot-password.template.hbs'),
            context: {
                title: title,
                otp: mailData.data.otp,
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