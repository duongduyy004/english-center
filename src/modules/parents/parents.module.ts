import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentEntity } from './entities/parent.entity';
import { ParentRepository } from './parent.repository';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParentEntity]),
    UsersModule
  ],
  controllers: [ParentsController],
  providers: [ParentsService, ParentRepository]
})
export class ParentsModule { }
