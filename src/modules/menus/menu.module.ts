import { Module } from '@nestjs/common';
import { MenusService } from './menu.service';
import { MenusController } from './menu.controller';
import { MenusRepository } from './menu.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity])],
  controllers: [MenusController],
  providers: [MenusService, MenusRepository]
})
export class MenuModule { }
