import { Allow } from 'class-validator';
import { Menu } from '../menus/menu.domain';

export class Article {
    @Allow()
    id: string;

    @Allow()
    title: string;

    @Allow()
    content: string;

    @Allow()
    file: string;

    @Allow()
    publicId: string;

    @Allow()
    menu: Menu;

    @Allow()
    createdAt: Date;

    @Allow()
    updatedAt: Date;
}
