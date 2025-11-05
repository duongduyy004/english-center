export class Menu {
    id: string;
    slug: string;
    title: string;
    order: number;
    isActive: boolean;
    childrenMenu: Menu[];
    parentMenu: Menu;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}