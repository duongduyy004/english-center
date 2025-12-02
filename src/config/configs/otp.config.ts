import { registerAs } from '@nestjs/config';
import { IsInt, IsString } from 'class-validator';
import validateConfig from '@/utils/validate-config';
import { OtpConfig } from '@/config/types/otp-config.type';

class OtpEnvValidator {
    @IsInt()
    OTP_DIGITS: number;

    @IsInt()
    OTP_PERIOD: number;

    @IsString()
    OTP_ALGORITHM: string;

    @IsString()
    OTP_SECRET: string;
}

export default registerAs<OtpConfig>('otp', () => {
    validateConfig(process.env, OtpEnvValidator);

    return {
        secret: process.env.OTP_SECRET,
        digits: parseInt(process.env.OTP_DIGITS ?? '6', 10),
        period: parseInt(process.env.OTP_PERIOD ?? '300', 10),
        algorithm: (process.env.OTP_ALGORITHM as 'SHA1' | 'SHA256' | 'SHA512') ?? 'SHA1',
    };
});
