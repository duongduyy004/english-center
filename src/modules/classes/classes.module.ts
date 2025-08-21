import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { ClassRepository } from './class.repository';
import { TeachersModule } from 'modules/teachers/teachers.module';
import { StudentsModule } from 'modules/students/students.module';
import { ClassStudentEntity } from './entities/class-student.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassEntity, ClassStudentEntity]),
    TeachersModule,
    StudentsModule,
    AuditLogModule
  ],
  controllers: [ClassesController],
  providers: [ClassesService, ClassRepository],
  exports: [ClassesService]
})
export class ClassesModule { }
