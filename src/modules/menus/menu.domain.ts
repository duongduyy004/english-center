export class Menu {
    id: string;
    slug: string;
    title: string;
    order: number;
    children: Menu[];
    parent: Menu;
}