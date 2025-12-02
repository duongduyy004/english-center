import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'config/config.type';
import { User } from 'modules/users/user.domain';
import { authenticator } from 'otplib';

@Injectable()
export class OtpService {
    constructor(
        private configService: ConfigService<AllConfigType>,
    ) {
        authenticator.options = { digits: 6 };
    }

    async generateOtp(userId: User['id']): Promise<string> {
        const TTL = this.configService.get('otp.period', { infer: true });
        const otp = authenticator.generate(this.configService.get('otp.secret', { infer: true }));
        return otp
    }

    // Verify OTP code
    verifyOtp(token: string): boolean {
        try {
            const secret = this.configService.get('otp.secret', { infer: true });
            const isValid = authenticator.verify({ token, secret })
            return isValid;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
