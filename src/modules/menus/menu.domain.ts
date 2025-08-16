export class Menu {
    id: string;
    url: string;
    title: string;
    order: number;
    children: Menu[];
    parent: Menu;
}