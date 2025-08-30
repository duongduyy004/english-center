import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackEntity } from './entities/feedback.entity';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackMapper } from './feedback.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity])],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository, FeedbackMapper],
  exports: [FeedbackService, FeedbackRepository]
})
export class FeedbackModule { }
