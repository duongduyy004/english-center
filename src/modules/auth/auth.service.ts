import { BadRequestException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { User } from '../users/user.domain';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';
import { Response } from 'express';
import { MailService } from 'modules/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { OtpService } from 'modules/otp/otp.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private i18nService: I18nService<I18nTranslations>,
    private configService: ConfigService<AllConfigType>,
    private mailService: MailService,
    private otpService: OtpService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isValid = await this.usersService.isValidPassword(pass, user?.password || '')
    if (isValid) return user;
    return null;
  }

  async login(user: User, response: Response) {
    const { id, name, email, role, address, gender, dayOfBirth, phone, avatar, publicId } = user
    const payload = {
      sub: 'token login',
      iss: 'server',
      id, name, email, role
    }

    const refreshToken = this.createRefreshToken(payload)
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 2592000 * 1000
    })

    await this.usersService.updateUserToken(user, refreshToken)

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.jwt_access_secret', { infer: true }),
        expiresIn: this.configService.get('jwt.jwt_access_expiration_minutes', { infer: true })
      }),
      user: {
        id, name, email, role, address, gender, dayOfBirth, phone, avatar, publicId
      }
    }
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.jwt_refresh_secret', { infer: true }),
      expiresIn: this.configService.get('jwt.jwt_refresh_expiration_days', { infer: true })
    })
    return refresh_token;
  }

  async processNewToken(refreshToken: string, response: Response) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.jwt_refresh_secret', { infer: true })
      })

      const user = await this.usersService.findUserByToken(payload.role, refreshToken)

      if (user) {
        const { id, name, email, role, address, gender, dayOfBirth, phone } = user
        const payload = {
          sub: 'token login',
          iss: 'server',
          id, name, email, role,
        }

        //save refresh token database
        const refresh_token = this.createRefreshToken(payload)
        this.usersService.updateUserToken(user, refresh_token)
        response.clearCookie('refresh_token')
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: 2592000 * 1000
        });

        return {
          access_token: this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.jwt_access_secret', { infer: true }),
            expiresIn: this.configService.get('jwt.jwt_access_expiration_minutes', { infer: true })
          }),
          user: {
            id, name, email, role, address, gender, dayOfBirth, phone
          }
        }
      } else {
        throw new NotFoundException(this.i18nService.t('common.NOT_FOUND', {
          args: {
            entity: "user"
          }
        }))
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }


  async sendVerifyEmail(user: User) {
    const otp = await this.otpService.generateOtp(user.id);

    return this.mailService.verifyEmail({
      to: user.email,
      data: { otp },
    });
  }

  async verifyEmail(otp: string, userId: User['id']) {
    try {
      const isValidOTP = this.otpService.verifyOtp(otp);

      if (!isValidOTP) throw new BadRequestException('Invalid OTP')

      const user = await this.usersService.findUserById(userId);

      if (!user) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'userNotFound',
          },
        });
      }

      // Change status of isEmailVerified
      user.isEmailVerified = true;
      await this.usersService.setVerifiedEmail(userId, user);
      return 'success';
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  async sendRequestPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user)
      throw new BadRequestException('Email does not exist');

    if (!user.isEmailVerified)
      throw new UnprocessableEntityException(
        this.i18nService.t('forgot-password.EMAIL_NOT_VERIFIED'),
      );

    const otp = await this.otpService.generateOtp(user.id);

    return this.mailService.forgotPassword({
      data: { otp },
      to: user.email,
    });
  }

  async resetPassword(otp: string, forgotPasswordDto: ForgotPasswordDto) {
    try {
      const isValidOTP = this.otpService.verifyOtp(otp);

      if (!isValidOTP) throw new BadRequestException('Invalid OTP')

      const { newPassword, confirmPassword } = forgotPasswordDto;

      if (newPassword !== confirmPassword)
        throw new BadRequestException('Password not match');

      return await this.usersService.resetPassword(forgotPasswordDto.email, newPassword);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changePassword(userId: User['id'], changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findUserById(userId);

    if (!user) throw new BadRequestException('User not found');

    const isValidPassword = this.usersService.isValidPassword(changePasswordDto.oldPassword, user.password);
    if (!isValidPassword) throw new BadRequestException('Old password is incorrect');

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) throw new BadRequestException('Password not match');

    user.password = changePasswordDto.newPassword;

    await this.usersService.resetPassword(user.email, changePasswordDto.newPassword);
  }
}
