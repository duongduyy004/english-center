import { Controller, Get, Post, Req, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CheckPolicies, Public } from '@/decorator/customize.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { RoleEnum } from '../roles/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) { }


  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('user/login')
  loginUser(@Req() req, @Res({ passthrough: true }) response: Response) {
    if (
      req.user &&
      req.user.role &&
      req?.user?.role?.id !== RoleEnum.parent &&
      req?.user?.role?.id !== RoleEnum.student
    ) {
      throw new BadRequestException(this.i18nService.t('auth.INCORRECT'));
    }
    return this.authService.login(req.user, response);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('admin/login')
  loginAdmin(@Req() req, @Res({ passthrough: true }) response: Response) {
    if (
      req.user &&
      req.user.role &&
      req?.user?.role?.id !== RoleEnum.admin &&
      req?.user?.role?.id !== RoleEnum.teacher
    ) {
      throw new BadRequestException(this.i18nService.t('auth.INCORRECT'));
    }
    return this.authService.login(req.user, response)
  }


  @Get('refresh')
  @Public()
  getRefreshToken(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const { refresh_token } = req.cookies
    return this.authService.processNewToken(refresh_token, response)
  }
}
