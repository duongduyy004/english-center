import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClassesService } from 'modules/classes/classes.service';
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly classesService: ClassesService) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateClassStatusCron() {
    this.logger.log('Automatically updating class status...');
    await this.classesService.updateClassStatus();
    return 'Class status updated successfully.';
  }
  async updateClassStatusManual() {
    this.logger.log('Manually updating class status...');
    await this.classesService.updateClassStatus();
    return 'Class status updated successfully.';
  }
}
