import { Injectable } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { RegistrationRepository } from './registration.repository';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { Registration } from './registration.domain';

@Injectable()
export class RegistrationsService {
  constructor(private registrationRepository: RegistrationRepository) { }
  async create(data: CreateRegistrationDto) {
    return this.registrationRepository.create(data);
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: any;
    sortOptions?: any;
    paginationOptions?: IPaginationOptions;
  }): Promise<PaginationResponseDto<Registration>> {
    return this.registrationRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: string) {
    return this.registrationRepository.findById(id);
  }

  async update(id: string, updateRegistrationDto: UpdateRegistrationDto) {
    return this.registrationRepository.update(id, updateRegistrationDto);
  }

  async remove(id: string) {
    return this.registrationRepository.remove(id);
  }
}
