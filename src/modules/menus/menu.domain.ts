export class Menu {
    id: string;
    slug: string;
    title: string;
    order: number;
    isActive: boolean;
    children: Menu[];
    parentMenu: Menu;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}