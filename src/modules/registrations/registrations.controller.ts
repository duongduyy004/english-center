import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { Public } from '@/decorator/customize.decorator';
import { QueryDto } from '@/utils/types/query.dto';
import { Filter } from 'typeorm';
import {
  FilterRegistrationDto,
  SortRegistrationDto,
} from './dto/query-registration.dto';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Public()
  @Post()
  create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationsService.create(createRegistrationDto);
  }

  @Get()
  findAll(
    @Query() query: QueryDto<FilterRegistrationDto, SortRegistrationDto>,
  ) {
    const page = query?.page;
    const limit = query?.limit;
    return this.registrationsService.findAll({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegistrationDto: UpdateRegistrationDto,
  ) {
    return this.registrationsService.update(id, updateRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrationsService.remove(id);
  }
}
