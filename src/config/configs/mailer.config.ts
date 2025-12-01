import { registerAs } from '@nestjs/config';
import { IsString, IsInt, IsBoolean, IsEmail } from 'class-validator';
import validateConfig from '@/utils/validate-config';
import { MailerConfig } from 'config/types/mailer-config.type'

class EnvironmentVariablesValidator {
    @IsString()
    MAILER_HOST: string;

    @IsInt()
    MAILER_PORT: number;

    @IsString()
    MAILER_USERNAME: string;

    @IsString()
    MAILER_PASSWORD: string;

    @IsBoolean()
    MAILER_IGNORE_TLS: boolean;

    @IsBoolean()
    MAILER_SECURE: boolean;

    @IsBoolean()
    MAILER_REQUIRE_TLS: boolean;

    @IsEmail()
    MAILER_DEFAULT_EMAIL: string;

    @IsString()
    MAILER_DEFAULT_NAME: string;

    @IsInt()
    MAILER_CLIENT_PORT: number;
}

export default registerAs<MailerConfig>('mailer', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        host: process.env.MAILER_HOST,
        port: parseInt(process.env.MAILER_PORT ?? '587', 10),
        username: process.env.MAILER_USERNAME,
        password: process.env.MAILER_PASSWORD,
        ignoreTls: process.env.MAILER_IGNORE_TLS === 'true',
        secure: process.env.MAILER_SECURE === 'true',
        requireTls: process.env.MAILER_REQUIRE_TLS === 'true',
        defaultEmail: process.env.MAILER_DEFAULT_EMAIL,
        defaultName: process.env.MAILER_DEFAULT_NAME,
        clientPort: parseInt(process.env.MAILER_CLIENT_PORT ?? '1080', 10),
    };
});