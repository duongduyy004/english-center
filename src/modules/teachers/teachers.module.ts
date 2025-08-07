import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherEntity } from './entities/teacher.entity';
import { TeacherRepository } from './teacher.repository';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeacherEntity]),
    UsersModule
  ],
  controllers: [TeachersController],
  providers: [TeachersService, TeacherRepository],
  exports: [TeachersService]
})
export class TeachersModule { }
