import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenusService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './menu.domain';
import { Public } from '@/decorator/customize.decorator';

@Controller('menus')
export class MenusController {
  constructor(private readonly menuService: MenusService) { }

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.menuService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: Menu['id'], @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  delete(@Param('id') id: Menu['id']) {
    return this.menuService.delete(id);
  }
}
