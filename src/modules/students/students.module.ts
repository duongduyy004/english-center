import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { UsersModule } from 'modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './entities/student.entity';
import { StudentRepository } from './student.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity]),
    UsersModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentRepository],
  exports: [StudentsService]
})
export class StudentsModule { }
