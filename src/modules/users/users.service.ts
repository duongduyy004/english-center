import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/users/entities/user.entity';
import { ParentEntity } from 'modules/parents/entities/parent.entity';
import { StudentEntity } from 'modules/students/entities/student.entity';
import { TeacherEntity } from 'modules/teachers/entities/teacher.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleEnum } from 'modules/roles/roles.enum';
import { UserMapper } from './user.mapper';
import { User } from './user.domain';

@Injectable()
export class UsersService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ParentEntity) private parentRepository: Repository<ParentEntity>,
    @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>,
    @InjectRepository(TeacherEntity) private teacherRepository: Repository<TeacherEntity>,
  ) { }

  async isEmailExist(email: string) {
    const userExists = await this.userRepository.findOne({
      where: { email }
    });
    if (userExists) {
      throw new BadRequestException(this.i18nService.t('user.FAIL.EMAIL_EXIST'));
    }

    const parentExists = await this.parentRepository.findOne({
      where: { email }
    });
    if (parentExists) {
      throw new BadRequestException(this.i18nService.t('user.FAIL.EMAIL_EXIST'));
    }

    const studentExists = await this.studentRepository.findOne({
      where: { email }
    });
    if (studentExists) {
      throw new BadRequestException(this.i18nService.t('user.FAIL.EMAIL_EXIST'));
    }

    const teacherExists = await this.teacherRepository.findOne({
      where: { email }
    });
    if (teacherExists) {
      throw new BadRequestException(this.i18nService.t('user.FAIL.EMAIL_EXIST'));
    }

    return false;
  }

  async findByEmail(email: string) {
    const userExists = await this.userRepository.findOne({
      where: { email }
    })
    if (userExists) return userExists

    const parentExists = await this.parentRepository.findOne({
      where: { email }
    });
    if (parentExists) return parentExists;

    const studentExists = await this.studentRepository.findOne({
      where: { email }
    });
    if (studentExists) return studentExists;

    const teacherExists = await this.teacherRepository.findOne({
      where: { email }
    });
    if (teacherExists) return teacherExists;
  }

  isValidPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async createAdmin(createUserDto: CreateUserDto) {
    await this.isEmailExist(createUserDto.email);
    const newEntity = await this.userRepository.save(
      this.userRepository.create({ ...createUserDto, role: { id: RoleEnum.admin } } as UserEntity), { transaction: true }
    )
    return UserMapper.toDomain(newEntity)
  }

  async updateUserToken(user: User, refreshToken: string) {
    if (user.role.id === RoleEnum.admin) {
      await this.userRepository.update({ id: user.id }, { refreshToken })
    }
    if (user.role.id === RoleEnum.teacher) {
      await this.teacherRepository.update({ id: user.id }, { refreshToken })
    }
    if (user.role.id === RoleEnum.parent) {
      await this.parentRepository.update({ id: user.id }, { refreshToken })
    }
    if (user.role.id === RoleEnum.student) {
      await this.studentRepository.update({ id: user.id }, { refreshToken })
    }
  }
}
