import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisementsService } from './advertisements.service';
import { AdvertisementsController } from './advertisements.controller';
import { AdvertisementEntity } from './entities/advertisement.entity';
import { AdvertisementRepository } from './advertisement.repository';
import { AdvertisementMapper } from './advertisement.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertisementEntity])],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService, AdvertisementRepository, AdvertisementMapper],
  exports: [AdvertisementsService, AdvertisementRepository]
})
export class AdvertisementsModule { }
