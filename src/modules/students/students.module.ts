import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { UsersModule } from '@/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEnity } from './entities/student.entity';
import { StudentRepository } from './student.repository';
import { UsersService } from '@/modules/users/users.service';
import { UserRepository } from '../users/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEnity]),
    UsersModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentRepository]
})
export class StudentsModule { }
