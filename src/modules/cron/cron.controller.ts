import { Controller, Post } from '@nestjs/common';
import { CronService } from './cron.service';
import { ResponseMessage } from 'decorator/customize.decorator';
@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}
  @Post('update-class-status')
  @ResponseMessage('cron.SUCCESS.UPDATE_CLASS_STATUS')
  async updateClassStatusManual() {
    return await this.cronService.updateClassStatusManual();
  }
}
