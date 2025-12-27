import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'modules/users/entities/user.entity';
import { ParentEntity } from 'modules/parents/entities/parent.entity';
import { StudentEntity } from 'modules/students/entities/student.entity';
import { TeacherEntity } from 'modules/teachers/entities/teacher.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleEnum } from 'modules/roles/roles.enum';
import { UserMapper } from './user.mapper';
import { User } from './user.domain';
import { FilesService } from 'modules/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ParentEntity) private parentRepository: Repository<ParentEntity>,
    @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>,
    @InjectRepository(TeacherEntity) private teacherRepository: Repository<TeacherEntity>,
    private readonly filesService: FilesService
  ) { }

  async isEmailExist(email: string): Promise<boolean> {
    const [user, teacher, parent, student] = await Promise.all([
      this.userRepository.createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getExists(),
      this.teacherRepository.createQueryBuilder('teacher')
        .where('teacher.email = :email', { email })
        .getExists(),
      this.parentRepository.createQueryBuilder('parent')
        .where('parent.email = :email', { email })
        .getExists(),
      this.studentRepository.createQueryBuilder('student')
        .where('student.email = :email', { email })
        .getExists()
    ])

    return user || teacher || parent || student;
  }

  async findByEmail(email: string): Promise<UserEntity | ParentEntity | StudentEntity | TeacherEntity | null> {
    const [user, parent, student, teacher] = await Promise.all([
      this.userRepository.findOne({ where: { email }, relations: ['role'] }),
      this.parentRepository.findOne({ where: { email }, relations: ['role'] }),
      this.studentRepository.findOne({ where: { email }, relations: ['role'] }),
      this.teacherRepository.findOne({ where: { email }, relations: ['role'] }),
    ]);

    return user || parent || student || teacher || null;
  }

  isValidPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    await this.isEmailExist(createUserDto.email);
    const newEntity = await this.userRepository.save(
      this.userRepository.create({ ...createUserDto, role: { id: RoleEnum.admin } } as UserEntity)
    );
    return UserMapper.toDomain(newEntity);
  }

  async updateUserToken(user: any, refreshToken: string): Promise<void> {
    const roleId = user.role?.id;

    const updateMap: Record<string, Repository<any>> = {
      [RoleEnum.admin]: this.userRepository,
      [RoleEnum.teacher]: this.teacherRepository,
      [RoleEnum.parent]: this.parentRepository,
      [RoleEnum.student]: this.studentRepository,
    };

    const repository = updateMap[roleId];
    if (repository) {
      await repository.update({ id: user.id }, { refreshToken });
    }
  }

  async findUserByToken(role: any, refreshToken: string): Promise<UserEntity | ParentEntity | StudentEntity | TeacherEntity | null> {
    const roleId = role?.id;

    const repositoryMap: Record<string, Repository<any>> = {
      [RoleEnum.admin]: this.userRepository,
      [RoleEnum.teacher]: this.teacherRepository,
      [RoleEnum.parent]: this.parentRepository,
      [RoleEnum.student]: this.studentRepository,
    };

    const repository = repositoryMap[roleId];
    return repository ? await repository.findOne({ where: { refreshToken }, relations: ['role'] }) : null;
  }

  async uploadAvatar(imageUrl: string, publicId: string, user: User): Promise<void> {
    const roleId = user?.role?.id;

    const repositoryMap: Record<string, { repo: Repository<any> }> = {
      [RoleEnum.admin]: { repo: this.userRepository },
      [RoleEnum.teacher]: { repo: this.teacherRepository },
      [RoleEnum.parent]: { repo: this.parentRepository },
      [RoleEnum.student]: { repo: this.studentRepository },
    };

    const config = repositoryMap[roleId];
    if (!config) return;

    const entity = await config.repo.findOne({ where: { id: user.id } });
    if (!entity) {
      throw new NotFoundException(this.i18nService.t('user.FAIL.NOT_FOUND'));
    }

    if (entity && entity.publicId && entity.avatar) {
      await this.filesService.deleteFile(entity.publicId);
      entity.avatar = null;
      entity.publicId = null
    }

    if (roleId !== RoleEnum.admin && entity.avatar && entity.publicId) {
      throw new BadRequestException('Avatar already exists. Please delete the current avatar before uploading a new one.');
    }

    entity.avatar = imageUrl;
    entity.publicId = publicId;
    await config.repo.save(entity);
  }

  async findUserById(userId: User['id']) {
    const [user, parent, student, teacher] = await Promise.all([
      this.userRepository.findOne({ where: { id: userId }, relations: ['role'] }),
      this.parentRepository.findOne({ where: { id: userId }, relations: ['role'] }),
      this.studentRepository.findOne({ where: { id: userId }, relations: ['role'] }),
      this.teacherRepository.findOne({ where: { id: userId }, relations: ['role'] }),
    ]);

    return user || parent || student || teacher || null;
  }

  async assignRole(userId: string, roleId: RoleEnum): Promise<UserEntity | ParentEntity | StudentEntity | TeacherEntity> {
    // Find the user in all possible tables
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.FAIL.NOT_FOUND'));
    }

    // Get the current role to determine which repository to use
    const currentRoleId = user.role?.id;

    const repositoryMap: Record<string, Repository<any>> = {
      [RoleEnum.admin]: this.userRepository,
      [RoleEnum.teacher]: this.teacherRepository,
      [RoleEnum.parent]: this.parentRepository,
      [RoleEnum.student]: this.studentRepository,
    };

    const repository = repositoryMap[currentRoleId] || this.userRepository;

    if (!repository) {
      throw new BadRequestException('Invalid current role');
    }

    // Update the role
    await repository.update(
      { id: userId },
      { role: { id: roleId } }
    );

    // Fetch and return the updated user
    const updatedUser = await repository.findOne({
      where: { id: userId },
      relations: ['role']
    });

    return updatedUser;
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.findByEmail(email);
    user.password = newPassword;
    return await this.userRepository.save(user);
  }

  async setVerifiedEmail(id: User['id'], user: UserEntity) {
    const currentRoleId = user.role?.id;

    const repositoryMap: Record<string, Repository<any>> = {
      [RoleEnum.admin]: this.userRepository,
      [RoleEnum.teacher]: this.teacherRepository,
      [RoleEnum.parent]: this.parentRepository,
      [RoleEnum.student]: this.studentRepository,
    };

    const repository = repositoryMap[currentRoleId] || this.userRepository;

    return await repository.update({ id: user.id }, { isEmailVerified: true })
  }
}
