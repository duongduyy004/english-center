import { registerAs } from '@nestjs/config';
import validateConfig from 'utils/validate-config';
import { IsString } from 'class-validator';
import { PaymentConfig } from 'config/types/payment-config.type';

class EnvironmentVariablesValidator {
    @IsString()
    PAYMENT_BANK: string;

    @IsString()
    PAYMENT_ACC: string;

    @IsString()
    PAYMENT_API_KEY: string;
}

export default registerAs<PaymentConfig>('payment', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);
    return {
        bank: process.env.PAYMENT_BANK,
        acc: process.env.PAYMENT_ACC,
        apiKey: process.env.PAYMENT_API_KEY
    };
});
