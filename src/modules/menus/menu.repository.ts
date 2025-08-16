import { InjectRepository } from "@nestjs/typeorm";
import { MenuEntity } from "./entities/menu.entity";
import { Repository, TreeRepository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { Menu } from "./menu.domain";
import { UpdateMenuDto } from "./dto/update-menu.dto";

@Injectable()
export class MenusRepository {
    private treeRepo: TreeRepository<MenuEntity>;
    constructor(
        @InjectRepository(MenuEntity) private menuRepository: Repository<MenuEntity>
    ) {
        this.treeRepo = this.menuRepository.manager.getTreeRepository(MenuEntity);
    }

    async create(createMenuDto: CreateMenuDto) {
        const menuEntity = new MenuEntity();
        menuEntity.title = createMenuDto.title;
        menuEntity.url = createMenuDto.url;

        if (createMenuDto.parentId) {
            menuEntity.parent = await this.menuRepository.findOne({ where: { id: createMenuDto.parentId } })
        }

        return await this.menuRepository.save(menuEntity)
    }

    async getAllMenus() {
        return this.treeRepo.findTrees();
    }

    async updateMenu(id: Menu['id'], updateMenuDto: UpdateMenuDto) {
        const entity = await this.menuRepository.findOne({ where: { id } });
        if (updateMenuDto.title) entity.title = updateMenuDto.title;
        if (updateMenuDto.url) entity.url = updateMenuDto.url;
        if (updateMenuDto.order) entity.order = updateMenuDto.order;
        if (updateMenuDto.parentId) entity.parent = await this.menuRepository.findOne({ where: { id: updateMenuDto.parentId } });

        return await this.menuRepository.save(entity);
    }

    async deleteMenu(id: Menu['id']) {
        return await this.menuRepository.softRemove({ id })
    }
}