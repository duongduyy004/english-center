import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from "bcrypt";
import { User } from '@/users/user.domain';
import { UserRepository } from '@/users/user.repository';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { FilterUserDto, SortUserDto } from '@/users/dto/query-user.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly i18nService: I18nService<I18nTranslations>
  ) { }

  private hashPassword(password: string) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let { name, email, password, gender, dayOfBirth, address, phone } = createUserDto

    const isEmailExist = await this.userRepository.findByEmail(email)

    if (isEmailExist) throw new BadRequestException(this.i18nService.t('user.FAIL.EMAIL_EXIST'))

    if (password) {
      password = this.hashPassword(password) || undefined
    }

    return this.userRepository.create({
      name,
      email,
      password,
      gender,
      dayOfBirth,
      address,
      phone
    })
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto> {
    return this.userRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions })
  }

  async findOne(id: User['id']) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.FAIL.NOT_FOUND'))
    }
    return user;
  }

  async update(id: User['id'], updateUserDto: UpdateUserDto) {
    let { name, email, gender, dayOfBirth, address, phone } = updateUserDto
    if (updateUserDto && updateUserDto.email) {
      const user = await this.userRepository.findByEmail(updateUserDto.email)
      if (user)
        throw new BadRequestException(this.i18nService.t('user.FAIL.EMAIL_EXIST'))
    }

    return this.userRepository.update(id, {
      name,
      email,
      gender,
      dayOfBirth,
      address,
      phone
    })
  }

  async delete(id: User['id']) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.FAIL.NOT_FOUND'))
    }
    return this.userRepository.delete(id);
  }
}
