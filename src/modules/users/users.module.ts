import { Module } from '@nestjs/common';
import { UsersService } from 'modules/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'modules/users/entities/user.entity';
import { StudentEntity } from 'modules/students/entities/student.entity';
import { ParentEntity } from 'modules/parents/entities/parent.entity';
import { TeacherEntity } from 'modules/teachers/entities/teacher.entity';
import { UsersController } from './user.controller';
import { FilesService } from 'modules/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      StudentEntity,
      ParentEntity,
      TeacherEntity
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, FilesService],
  exports: [UsersService]
})
export class UsersModule { }
