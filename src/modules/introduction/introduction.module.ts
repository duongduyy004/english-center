import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntroductionService } from './introduction.service';
import { IntroductionController } from './introduction.controller';
import { IntroductionEntity } from './entities/introduction.entity';
import { IntroductionRepository } from './introduction.repository';
import { IntroductionMapper } from './introduction.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([IntroductionEntity])],
  controllers: [IntroductionController],
  providers: [IntroductionService, IntroductionRepository, IntroductionMapper],
  exports: [IntroductionService, IntroductionRepository]
})
export class IntroductionModule { }
