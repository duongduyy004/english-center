import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'config/config.type';
import nodemailer from 'nodemailer'
import Handlebars from 'handlebars';
import fs from 'fs/promises';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      auth: {
        user: this.configService.get('mailer.username', { infer: true }),
        pass: this.configService.get('mailer.password', { infer: true })
      },
      host: this.configService.get('mailer.host', { infer: true }),
      port: this.configService.get('mailer.port', { infer: true }),
      ignoreTLS: this.configService.get('mailer.ignoreTls', { infer: true }),
      secure: this.configService.get('mailer.secure', { infer: true }),
      requireTLS: this.configService.get('mailer.requireTls', { infer: true }),
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mailer.defaultName', {
          infer: true,
        })}" <${this.configService.get('mailer.defaultEmail', {
          infer: true,
        })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }

}
