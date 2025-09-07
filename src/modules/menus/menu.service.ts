import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenusRepository } from './menu.repository';
import { Menu } from './menu.domain';

@Injectable()
export class MenusService {
  constructor(
    private menuRepository: MenusRepository
  ) { }
  create(createMenuDto: CreateMenuDto) {
    return this.menuRepository.create(createMenuDto);
  }

  findAll() {
    return this.menuRepository.getAllMenus();
  }

  findOne(id: Menu['id']) {
    return this.menuRepository.findById(id);
  }

  update(id: Menu['id'], updateMenuDto: UpdateMenuDto) {
    return this.menuRepository.updateMenu(id, updateMenuDto);
  }

  delete(id: Menu['id']) {
    return this.menuRepository.deleteMenu(id);
  }
}
