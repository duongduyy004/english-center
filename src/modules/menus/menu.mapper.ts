import { Menu } from './menu.domain';
import { MenuEntity } from './entities/menu.entity';

export class MenuMapper {
    static toDomain(entity: MenuEntity): Menu {
        if (!entity) {
            return null;
        }

        const domain = new Menu();
        domain.id = entity.id;
        domain.url = entity.url;
        domain.title = entity.title;
        domain.order = entity.order;

        // Map children if they exist
        if (entity.children && entity.children.length > 0) {
            domain.children = entity.children.map(child => MenuMapper.toDomain(child));
        } else {
            domain.children = [];
        }

        // Map parent if it exists
        if (entity.parent) {
            domain.parent = MenuMapper.toDomain(entity.parent);
        }

        return domain;
    }

    static toPersistence(domain: Menu): MenuEntity {
        if (!domain) {
            return null;
        }

        const entity = new MenuEntity();
        entity.id = domain.id;
        entity.url = domain.url;
        entity.title = domain.title;
        entity.order = domain.order;

        // Map children if they exist
        if (domain.children && domain.children.length > 0) {
            entity.children = domain.children.map(child => MenuMapper.toPersistence(child));
        }

        // Map parent if it exists
        if (domain.parent) {
            entity.parent = MenuMapper.toPersistence(domain.parent);
        }

        return entity;
    }
}
