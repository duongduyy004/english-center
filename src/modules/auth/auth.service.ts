import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import * as bcrypt from 'bcrypt'
import { User } from '../users/user.domain';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';
import { Response } from 'express';
import { RoleEnum } from '../roles/roles.enum';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private i18nService: I18nService<I18nTranslations>,
    private configService: ConfigService<AllConfigType>
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isValid = this.usersService.isValidPassword(pass, user?.password || '')
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
}
