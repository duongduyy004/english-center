export class Menu {
    id: string;
    slug: string;
    title: string;
    order: number;
    isActive: boolean;
    children: Menu[];
    parent: Menu;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}