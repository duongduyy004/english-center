import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassRepository } from './class.repository';
import { FilterClassDto, SortClassDto } from './dto/query-class.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { Class } from './class.domain';

@Injectable()
export class ClassesService {
  constructor(private classRepository: ClassRepository) { }
  create(createClassDto: CreateClassDto) {
    return this.classRepository.create(createClassDto);
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterClassDto | null;
    sortOptions?: SortClassDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Class>> {
    return this.classRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions })
  }

  findOne(id: Class['id']) {
    return this.classRepository.findById(id);
  }

  update(id: Class['id'], updateClassDto: UpdateClassDto) {
    return this.classRepository.update(id, updateClassDto);
  }

}
