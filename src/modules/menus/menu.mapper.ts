import { Menu } from './menu.domain';
import { MenuEntity } from './entities/menu.entity';

export class MenuMapper {
    static toDomain(entity: MenuEntity): Menu {
        if (!entity) {
            return null;
        }

        const domain = new Menu();
        domain.id = entity.id;
        domain.slug = entity.slug;
        domain.title = entity.title;
        domain.order = entity.order;
        domain.isActive = entity.isActive;
        domain.createdAt = entity.createdAt;
        domain.updatedAt = entity.updatedAt;
        domain.deletedAt = entity.deletedAt;

        // Map childrenMenu if they exist
        if (entity.childrenMenu && entity.childrenMenu.length > 0) {
            domain.childrenMenu = entity.childrenMenu.map(child => MenuMapper.toDomain(child));
        } else {
            domain.childrenMenu = [];
        }

        // Map parentMenu if it exists
        if (entity.parentMenu) {
            domain.parentMenu = MenuMapper.toDomain(entity.parentMenu);
        }

        return domain;
    }

    static toPersistence(domain: Menu): MenuEntity {
        if (!domain) {
            return null;
        }

        const entity = new MenuEntity();
        entity.id = domain.id;
        entity.slug = domain.slug;
        entity.title = domain.title;
        entity.order = domain.order;
        entity.isActive = domain.isActive;

        // Map childrenMenu if they exist
        if (domain.childrenMenu && domain.childrenMenu.length > 0) {
            entity.childrenMenu = domain.childrenMenu.map(child => MenuMapper.toPersistence(child));
        }

        // Map parentMenu if it exists
        if (domain.parentMenu) {
            entity.parentMenu = MenuMapper.toPersistence(domain.parentMenu);
        }

        return entity;
    }
}
