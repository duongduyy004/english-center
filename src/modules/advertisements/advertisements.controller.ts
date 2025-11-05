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
import { AdvertisementsService } from './advertisements.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { Public, ResponseMessage } from '@/decorator/customize.decorator';
import { QueryDto } from '@/utils/types/query.dto';
import {
  FilterAdvertisementDto,
  SortAdvertisementDto,
} from './dto/query-advertisement.dto';
import { Advertisement } from './advertisement.domain';

@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly advertisementsService: AdvertisementsService) {}

  @Post()
  create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return this.advertisementsService.create(createAdvertisementDto);
  }

  @Get()
  findAll(
    @Query() query: QueryDto<FilterAdvertisementDto, SortAdvertisementDto>,
  ) {
    const page = query?.page;
    const limit = query?.limit;
    return this.advertisementsService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @Get('banners/:limit')
  @Public()
  getLimitBanners(@Param('limit') limit: string) {
    return this.advertisementsService.getLimitBanners(+limit);
  }

  @Get('popup')
  @Public()
  getHighestPriorityPopup() {
    return this.advertisementsService.getHighestPriorityPopup();
  }

  @Get(':id')
  findOne(@Param('id') id: Advertisement['id']) {
    return this.advertisementsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Advertisement['id'],
    @Body() updateAdvertisementDto: UpdateAdvertisementDto,
  ) {
    return this.advertisementsService.update(id, updateAdvertisementDto);
  }

  @Delete(':id')
  delete(@Param('id') id: Advertisement['id']) {
    return this.advertisementsService.delete(id);
  }
}
